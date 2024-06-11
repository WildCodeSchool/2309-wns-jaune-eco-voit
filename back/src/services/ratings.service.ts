import { Repository } from 'typeorm'
import { CreateRatingInput, RatingEntity } from '../entities/rating.entity'
import DataSource from '../db'
import { assertDataExists, validateData } from '../utils/errorHandlers'

export default class RatingsService {
    db: Repository<RatingEntity>
    constructor() {
        this.db = DataSource.getRepository(RatingEntity)
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

    async createRating(data: CreateRatingInput) {
        const newRating: RatingEntity = this.db.create(data)

        await validateData(newRating)

        const ratingSaved = await this.db.save(newRating)

        return await this.findRatingById(ratingSaved.id)
    }
}
