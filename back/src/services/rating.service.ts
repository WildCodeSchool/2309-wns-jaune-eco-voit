import { Repository } from 'typeorm'
import { CreateRatingInput, RatingEntity } from '../entities/rating.entity'
import datasource from '../db'
import { assertDataExists, validateData } from '../utils/errorHandlers'
import BookingService from './booking.service'
import UserService from './user.service'

export default class RatingService {
    db: Repository<RatingEntity>

    constructor() {
        this.db = datasource.getRepository(RatingEntity)
    }

    async listRatingsByUser(id: string) {
        const ratings = await this.db.find({
            where: { userRated: { id } },
            relations: { userRated: true, booking: true },
        })

        assertDataExists(ratings)

        return ratings
    }

    async findRatingById(id: string) {
        return await this.db.findOne({
            where: { id },
            relations: { userRated: true, booking: true },
        })
    }

    async findRatingByBooking(bookingId: string) {
        return await this.db.findOne({
            where: { booking: { id: bookingId } },
            relations: { userRated: true, booking: true },
        })
    }

    async createRating(data: CreateRatingInput): Promise<RatingEntity> {
        const rating = this.db.create(data)
        validateData(rating)
        return await this.db.save(rating)
    }

    async createRatingAndUpdateAverage(
        data: CreateRatingInput
    ): Promise<RatingEntity> {
        const bookingService = new BookingService()
        const userService = new UserService()

        const {
            booking: { id: bookingId },
            userRated: { id: userRatedId },
        } = data

        const bookingData = await bookingService.findBookingById(bookingId)

        const { status: bookingStatus } = bookingData

        if (bookingStatus !== 'DONE') {
            throw new Error('Booking is not done')
        }

        const isBookingRated = await this.findRatingByBooking(bookingId)

        if (isBookingRated) {
            throw new Error('Booking already rated')
        }

        const newRating = await this.createRating(data)

        const driverRatings = await this.listRatingsByUser(userRatedId)

        const newAverageRate = parseFloat(
            (
                driverRatings.reduce(
                    (acc, curr) => acc + Number(curr.rate),
                    0
                ) / driverRatings.length
            ).toFixed(2)
        )

        await bookingService.updateBookingStatus({
            id: bookingId,
            status: 'RATED',
        })

        await userService.updateAverageRate({
            id: userRatedId,
            averageRate: newAverageRate,
        })

        return newRating
    }
}
