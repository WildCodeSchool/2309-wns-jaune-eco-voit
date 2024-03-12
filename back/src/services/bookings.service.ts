import { Repository } from 'typeorm'
import datasource from '../db'
import {
    BookingEntity,
    CreateBookingInput,
    UpdateBookingInput,
} from '../entities/booking.entity'
import { validateData, assertDataExists } from '../utils/errorHandlers'

export default class BookingsService {
    db: Repository<BookingEntity>

    constructor() {
        this.db = datasource.getRepository(BookingEntity)
    }

    async listBookings() {
        return await this.db.find({
            relations: { user: true, journey: true },
        })
    }

    async findBookingById(id: string) {
        const book = await this.db.findOne({
            where: { id },
            relations: { user: true, journey: true },
        })

        assertDataExists(book)

        return book as BookingEntity
    }

    async listBookingsByJourneyId(id: string) {
        return await this.db.find({
            where: { journey: { id } },
            relations: { user: true, journey: true },
        })
    }

    async listBookingsFilter({
        journeyId,
        userId,
    }: {
        journeyId?: string
        userId?: string
    }) {
        return await this.db.find({
            where: {
                user: { id: userId ?? undefined },
                journey: { id: journeyId ?? undefined },
            },
            relations: { user: true, journey: true },
        })
    }

    async createBooking(body: CreateBookingInput) {
        const newBooking: BookingEntity = this.db.create(body)

        await validateData(newBooking)

        const bookingSaved = await this.db.save(newBooking)

        return this.findBookingById(bookingSaved.id)
    }

    async updateBooking(id: string, body: UpdateBookingInput) {
        const bookingToUpdate = await this.findBookingById(id)

        const bookingUpdated = this.db.merge(bookingToUpdate, body)

        await validateData(bookingUpdated)

        const bookingSaved = await this.db.save(bookingUpdated)

        return await this.findBookingById(bookingSaved.id)
    }
}
