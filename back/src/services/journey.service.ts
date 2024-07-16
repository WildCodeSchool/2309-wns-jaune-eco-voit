import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'
import datasource from '../db'
import {
    JourneyEntity,
    CreateJourneyInput,
    UpdateJourneyInput,
    ListJourneysWithFilters,
    UpdateJourneyStatusInput,
} from '../entities/journey.entity'
import { validateData, assertDataExists } from '../utils/errorHandlers'
import dayjs from 'dayjs'
import BookingService from './booking.service'
import UserService from './user.service'
import SendEmailService from './sendEmail.service'

export default class JourneyService {
    db: Repository<JourneyEntity>

    constructor() {
        this.db = datasource.getRepository(JourneyEntity)
    }

    async findJourneyById(id: string): Promise<JourneyEntity> {
        const journey = await this.db.findOne({
            where: { id },
            relations: ['user', 'bookings', 'bookings.user'],
        })

        assertDataExists(journey)

        return journey as JourneyEntity
    }

    async findJourneyByBookingId(id: string): Promise<JourneyEntity> {
        const journey = await this.db.findOne({
            where: { bookings: { id } },
            relations: { user: true, bookings: true },
        })

        return journey as JourneyEntity
    }

    async listJourneys(
        filters?: ListJourneysWithFilters
    ): Promise<JourneyEntity[]> {
        return await this.db.find({
            where: {
                origin: filters?.origin,
                destination: filters?.destination,
                departure_time: filters?.departureTime
                    ? MoreThanOrEqual(filters.departureTime)
                    : undefined,
                automaticAccept: filters?.automaticAccept,
                availableSeats: filters?.availableSeats
                    ? MoreThanOrEqual(filters.availableSeats)
                    : undefined,
            },
            relations: { user: true, bookings: true },
        })
    }

    async listJourneysForScheduler(): Promise<JourneyEntity[]> {
        return await this.db.find({
            where: {
                departure_time: LessThanOrEqual(
                    dayjs().subtract(1, 'day').toDate()
                ),
                status: 'PLANNED',
            },
            relations: { user: true, bookings: true },
        })
    }

    async listJourneysByUser(userId: string): Promise<JourneyEntity[]> {
        return await this.db.find({
            where: {
                user: { id: userId },
            },
            relations: { user: true, bookings: true },
        })
    }

    async createJourney(data: CreateJourneyInput): Promise<JourneyEntity> {
        const newJourney: JourneyEntity = this.db.create(data)

        await validateData(newJourney)
        const { id } = await this.db.save(newJourney)
        return await this.findJourneyById(id)
    }

    async updateJourney({
        id,
        ...body
    }: UpdateJourneyInput): Promise<JourneyEntity> {
        const journeyToUpdate = await this.findJourneyById(id)

        const journeyToSave = this.db.merge(journeyToUpdate, body)

        await validateData(journeyToSave)

        return await this.db.save(journeyToUpdate)
    }

    async updateJourneyStatus({
        status: newStatus,
        id: journeyToUpdateId,
    }: UpdateJourneyStatusInput): Promise<JourneyEntity> {
        const bookingService = new BookingService()
        const sendEmailService = new SendEmailService()
        const userService = new UserService()

        const {
            user: { id: driverId },
            status: journeyStatus,
            id: journeyId,
        } = await this.findJourneyById(journeyToUpdateId)

        if (journeyStatus === 'CANCELLED') {
            throw new Error('This journey has been cancelled')
        }

        if (journeyStatus === 'DONE') {
            throw new Error('This journey is already done')
        }

        if (newStatus === journeyStatus) {
            throw new Error('Journey already has this status')
        }

        const bookings = await bookingService.listBookingsFilter({
            journeyId,
        })

        if (newStatus === 'CANCELLED') {
            this.updateJourney({ id: journeyId, status: newStatus })

            const acceptedBookings = bookings.filter(
                ({ status }) => status === 'ACCEPTED'
            )

            acceptedBookings.forEach(
                async ({
                    id,
                    user: { email: passengerEmail },
                    journey: { origin, destination },
                }) => {
                    await bookingService.updateBookingStatus({
                        id,
                        status: newStatus,
                    })

                    sendEmailService.sendCancelJourneyEmail({
                        recipient: passengerEmail,
                        origin,
                        destination,
                    })
                }
            )
        }

        if (newStatus === 'DONE') {
            const { tripsAsDriver } = await userService.findUserById(driverId)

            await userService.updateUser({
                id: driverId,
                tripsAsDriver: tripsAsDriver + 1,
                grade: userService.getDriverNewGrade(tripsAsDriver),
            })

            this.updateJourney({ id: journeyId, status: newStatus })

            const acceptedBookings = bookings.filter(
                ({ status }) => status === 'ACCEPTED'
            )

            acceptedBookings.forEach(
                async ({
                    id: bookingId,
                    user: { email: passengerEmail, id: passengerId },
                    nbPassenger,
                }) => {
                    const { tripsAsPassenger } =
                        await userService.findUserById(passengerId)

                    userService.updateUser({
                        id: passengerId,
                        tripsAsPassenger: tripsAsPassenger + nbPassenger,
                    })

                    await bookingService.updateBookingStatus({
                        id: bookingId,
                        status: newStatus,
                    })

                    sendEmailService.sendRateEmail({
                        recipient: passengerEmail,
                        bookingId,
                        driverId,
                    })
                }
            )
        }

        return this.findJourneyById(journeyId)
    }
}
