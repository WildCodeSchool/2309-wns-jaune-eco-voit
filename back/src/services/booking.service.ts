import { Repository } from 'typeorm'
import datasource from '../db'
import {
    BookingEntity,
    CreateBookingInput,
    ListBookingsFilterInput,
    UpdateBookingInput,
} from '../entities/booking.entity'
import { validateData, assertDataExists } from '../utils/errorHandlers'
import JourneyService from './journey.service'
import SendEmailService from './sendEmail.service'

export default class BookingService {
    db: Repository<BookingEntity>

    constructor() {
        this.db = datasource.getRepository(BookingEntity)
    }

    async listBookings(): Promise<BookingEntity[]> {
        return await this.db.find({
            relations: ['user', 'journey', 'journey.user'],
        })
    }

    async findBookingById(id: string): Promise<BookingEntity> {
        const book = await this.db.findOne({
            where: { id },
            relations: ['user', 'journey', 'journey.user'],
        })

        assertDataExists(book)

        return book as BookingEntity
    }

    async listBookingsFilter({
        journeyId,
        userId,
    }: ListBookingsFilterInput): Promise<BookingEntity[]> {
        return await this.db.find({
            where: {
                user: { id: userId ?? undefined },
                journey: { id: journeyId ?? undefined },
            },
            relations: ['user', 'journey', 'journey.user'],
        })
    }

    async updateBookingStatus({
        id,
        status,
    }: UpdateBookingInput): Promise<BookingEntity> {
        const bookingToUpdate = await this.findBookingById(id)

        const bookingUpdated = this.db.merge(bookingToUpdate, { status })

        await validateData(bookingUpdated)

        const { id: bookingSavedId } = await this.db.save(bookingUpdated)

        return await this.findBookingById(bookingSavedId)
    }

    async createBooking(data: CreateBookingInput): Promise<BookingEntity> {
        const journeyService = new JourneyService()
        const sendEmailService = new SendEmailService()

        const { journey, user, nbPassenger } = data

        const {
            availableSeats,
            automaticAccept,
            user: { id: driverId, email: driverEmail },
        } = await journeyService.findJourneyById(journey.id)

        if (availableSeats <= 0 || availableSeats < nbPassenger) {
            throw new Error('Le nombre de places disponibles est insuffisant')
        }

        if (user.id === driverId) {
            throw new Error('Vous ne pouvez pas réserver votre propre trajet')
        }

        const newBooking = this.db.create({
            ...data,
            status: automaticAccept ? 'ACCEPTED' : 'PENDING',
        })

        await validateData(newBooking)

        await this.db.save(newBooking)

        if (!automaticAccept) {
            sendEmailService.sendNewBookingEmail({
                recipient: driverEmail,
                newBookingId: newBooking.id,
                driverId,
            })
        }

        if (automaticAccept) {
            await journeyService.updateJourney({
                id: journey.id,
                availableSeats: availableSeats - nbPassenger,
            })
        }

        return await this.findBookingById(newBooking.id)
    }

    async acceptBooking(id: string): Promise<BookingEntity> {
        const journeyService = new JourneyService()
        const sendEmailService = new SendEmailService()

        const {
            journey: {
                id: journeyId,
                availableSeats,
                user: { firstname: driverFirstname },
            },
            user: { email: passengerEmail },
            nbPassenger,
        } = await this.findBookingById(id)

        if (availableSeats < nbPassenger) {
            throw new Error('Le nombre de places disponibles est insuffisant')
        }

        await journeyService.updateJourney({
            id: journeyId,
            availableSeats: availableSeats - nbPassenger,
        })

        const bookingAccepted = await this.updateBookingStatus({
            id,

            status: 'ACCEPTED',
        })

        if (bookingAccepted) {
            sendEmailService.sendAcceptBookingEmail({
                recipient: passengerEmail,
                journeyId,
                driverFirstname,
            })
        }

        return bookingAccepted
    }

    async rejectBooking(id: string): Promise<BookingEntity> {
        const sendEmailService = new SendEmailService()

        const {
            journey: {
                user: { firstname: driverFirstname },
            },
            user: { email: passengerEmail },
        } = await this.findBookingById(id)

        const bookingRejected = await this.updateBookingStatus({
            id,
            status: 'REJECTED',
        })

        if (bookingRejected) {
            sendEmailService.sendRejectBookingEmail({
                recipient: passengerEmail,
                driverFirstname,
            })
        }

        return bookingRejected
    }

    async cancelBooking(id: string): Promise<BookingEntity> {
        const journeyService = new JourneyService()
        const sendEmailService = new SendEmailService()

        const {
            journey: {
                availableSeats,
                id: journeyId,
                user: { email: driverEmail },
            },
            user: { firstname: passengerFistname },
            nbPassenger,
        } = await this.findBookingById(id)

        const cancelledBooking = await this.updateBookingStatus({
            id,
            status: 'CANCELLED',
        })

        validateData(cancelledBooking)

        await journeyService.updateJourney({
            id: journeyId,
            availableSeats: availableSeats + nbPassenger,
        })

        sendEmailService.sendCancelBookingEmail({
            recipient: driverEmail,
            passengerFistname,
        })

        return cancelledBooking
    }
}
