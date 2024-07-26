import { In, LessThanOrEqual, MoreThanOrEqual, Repository, Not } from 'typeorm'
import datasource from '../db'
import {
    JourneyEntity,
    CreateJourneyInput,
    UpdateJourneyInput,
    ListJourneysWithFilters,
    UpdateJourneyStatusInput,
} from '../entities/journey.entity'
import {
    validateData,
    assertDataExists,
    validateJourneyInputs,
} from '../utils/errorHandlers'
import dayjs from 'dayjs'
import BookingService from './booking.service'
import UserService from './user.service'
import SendEmailService from './sendEmail.service'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

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

        assertDataExists(journey)

        return journey as JourneyEntity
    }

    async listJourneys(
        filters?: ListJourneysWithFilters
    ): Promise<JourneyEntity[]> {
        if (filters) {
            const {
                origins,
                destinations,
                automaticAccept,
                availableSeats,
                departureTime,
                user
            } = filters
            return await this.db.find({
                where: {
                    origin: In(origins),
                    destination: In(destinations),
                    departureTime: MoreThanOrEqual(departureTime),
                    automaticAccept,
                    availableSeats: MoreThanOrEqual(availableSeats),
                    user: user?.id ? { id: Not(user.id) } : undefined
                },
                relations: { user: true, bookings: true },
            })
        }

        return await this.db.find({
            relations: { user: true, bookings: true },
        })
    }

    async listJourneysForScheduler(): Promise<JourneyEntity[]> {
        return await this.db.find({
            where: {
                departureTime: LessThanOrEqual(
                    dayjs().utc().subtract(1, 'day').toDate()
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

            relations: ['user', 'bookings', 'bookings.user'],
        })
    }

    async createJourney(data: CreateJourneyInput): Promise<JourneyEntity> {
        validateJourneyInputs(data)
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

        const { bookings } = journeyToUpdate

        if (bookings && bookings.length > 0) {
            throw new Error('You can not edit this journey')
        }

        validateJourneyInputs(body)

        await validateData(journeyToUpdate)

        const journeyToSave = this.db.merge(journeyToUpdate, body)

        return await this.db.save(journeyToSave)
    }

    async updateAvailableSeats({
        id,
        availableSeats,
    }: {
        id: string
        availableSeats: number
    }) {
        const journeyToUpdate = await this.findJourneyById(id)
        const journeyToSave = this.db.merge(journeyToUpdate, { availableSeats })

        return await this.db.save(journeyToSave)
    }

    async updateJourneyStatus({
        status: newStatus,
        id: id,
    }: UpdateJourneyStatusInput): Promise<JourneyEntity> {
        const bookingService = new BookingService()
        const sendEmailService = new SendEmailService()
        const userService = new UserService()

        const journeyToUpdate = await this.findJourneyById(id)

        const {
            user: { id: driverId },
            status: journeyStatus,
            id: journeyId,
        } = journeyToUpdate

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
            const journeyToSave = this.db.merge(journeyToUpdate, {
                status: newStatus,
            })

            this.db.save(journeyToSave)

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
                        status: 'CANCELLED',
                    })

                    sendEmailService.sendCancelledJourneyEmail({
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

            const journeyToSave = this.db.merge(journeyToUpdate, {
                status: newStatus,
            })

            this.db.save(journeyToSave)

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
                        status: 'DONE',
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
