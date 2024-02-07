import { Repository } from 'typeorm'
import datasource from '../db'
import { validate } from 'class-validator'
import {
    BookingEntity,
    CreateBookingInput,
    UpdateBookingInput,
} from '../entities/booking.entity'

export default class BookingsService {
    db: Repository<BookingEntity>

    constructor() {
        this.db = datasource.getRepository(BookingEntity)
    }

    async listBookings() {
        return await this.db.find({
            relations: {
                journey: true,
                user: true,
            },
        })
    }

    async findBookingById(id: string) {
        return await this.db.findOne({
            where: { id },
            relations: { journey: true, user: true },
        })
    }

    async listBookingsFilter(options: { journeyId?: string; userId?: string }) {
        const { userId, journeyId } = options
        return await this.db.find({
            where: {
                user: { id: userId ?? undefined },
                journey: { id: journeyId ?? undefined },
            },
        })
    }

    async create(body: CreateBookingInput) {
        const newBooking: BookingEntity = this.db.create(body)

        const errors = await validate(newBooking)

        if (errors.length !== 0) {
            console.log(errors)
            throw new Error('Something wrong with the validation')
        }

        const bookingSaved = await this.db.save(newBooking)

        return this.findBookingById(bookingSaved.id)
    }

    async updateBooking(id: string, body: UpdateBookingInput) {
        const bookingToUpdate = await this.db.findOneBy({ id })
        if (!bookingToUpdate) {
            throw new Error('Data not found')
        }
        const bookingUpdated = this.db.merge(bookingToUpdate, body)
        const errors = await validate(bookingUpdated)

        if (errors.length !== 0) {
            throw new Error('Something wrong with the body')
        }

        const bookingSaved = await this.db.save(bookingUpdated)

        return await this.findBookingById(bookingSaved.id)
    }
}
