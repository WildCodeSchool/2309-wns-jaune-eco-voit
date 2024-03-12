import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import JourneysService from '../services/journeys.service'

import {
    JourneyEntity,
    CreateJourneyInput,
    UpdateJourneyInput,
    UpdateJourneyStatusInput,
} from '../entities/journey.entity'
import UsersService from '../services/users.service'
import { MyContext } from '..'
import { userAuthorized } from '../utils/userAuthorized'
import BookingsService from '../services/bookings.service'

@Resolver()
export default class JourneyResolver {
    @Query(() => [JourneyEntity])
    async listJourneys() {
        return await new JourneysService().listJourneys()
    }

    @Query(() => JourneyEntity)
    async findJourneyById(@Arg('id') id: string) {
        return await new JourneysService().findJourneyById(id)
    }

    @Authorized()
    @Query(() => [JourneyEntity])
    async listJourneysByUser(
        @Arg('userId') userId: string,
        @Ctx() { req, res, user }: MyContext
    ) {
        // On vérifie l'id envoyé en argument correspond bien à un user existant
        // Si ce n'est pas le cas, une erreur sera envoyé directement depuis la méthode findUserById du userService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que le user existe
        await new UsersService().findUserById(userId)

        userAuthorized([userId], user)
        console.log('COUCOU')

        return await new JourneysService().listJourneysFilter({
            userId,
        })
    }

    @Authorized()
    @Mutation(() => JourneyEntity)
    async createJourney(
        @Arg('data') data: CreateJourneyInput,
        @Ctx() { req, res, user }: MyContext
    ) {
        userAuthorized([data.user.id], user)

        return await new JourneysService().createJourney(data)
    }

    @Authorized()
    @Mutation(() => JourneyEntity)
    async updateJourney(
        @Arg('data') data: UpdateJourneyInput,
        @Ctx() { req, res, user }: MyContext
    ) {
        const journeyService = new JourneysService()

        const { user: journeyUser } = await journeyService.findJourneyById(
            data.id
        )

        userAuthorized([journeyUser.id], user)

        return await journeyService.updateJourney(data)
    }

    @Authorized()
    @Mutation(() => JourneyEntity)
    async decreaseAvailableSeats(
        @Arg('id') id: string,
        @Ctx() { req, res, user }: MyContext
    ) {
        const { availableSeats, user: journeyUser } =
            await new JourneysService().findJourneyById(id)

        if (availableSeats <= 0) {
            throw Error("There's no more available seats for this journey")
        }

        userAuthorized([journeyUser.id], user)

        return await new JourneysService().updateJourney({
            id,
            availableSeats: availableSeats - 1,
        })
    }

    @Authorized()
    @Mutation(() => JourneyEntity)
    async increaseAvailableSeats(
        @Arg('id') id: string,
        @Ctx() { req, res, user }: MyContext
    ) {
        const {
            availableSeats,
            bookings,
            user: journeyUser,
        } = await new JourneysService().findJourneyById(id)

        userAuthorized([journeyUser.id], user)

        if (
            availableSeats >= 4 ||
            (bookings &&
                bookings.filter((booking) => booking.status === 'ACCEPTED')
                    ?.length >= 4)
        ) {
            throw new Error('Impossible to add a seat')
        }

        return await new JourneysService().updateJourney({
            id,
            availableSeats: availableSeats + 1,
        })
    }

    @Authorized()
    @Mutation(() => JourneyEntity)
    async updateJourneyStatus(
        @Arg('data') data: UpdateJourneyStatusInput,
        @Ctx() { req, res, user }: MyContext
    ) {
        const journeyService = new JourneysService()
        const bookingService = new BookingsService()

        const { user: journeyUser, status } =
            await journeyService.findJourneyById(data.id)

        const bookings = await bookingService.listBookingsByJourneyId(data.id)

        userAuthorized([journeyUser.id], user)

        if (status === 'CANCELLED')
            throw new Error('This journey had been cancelled')

        if (status === 'DONE') throw new Error('This journey is done')

        if (data.status === status)
            throw new Error('Journey already has this status')

        if (data.status === 'CANCELLED') {
            bookings
                ?.filter((booking) => booking.status !== 'CANCELLED')
                .forEach(async (booking) => {
                    return await bookingService.updateBooking(booking.id, {
                        status: 'CANCELLED',
                    })
                })
        }

        const usersService = new UsersService()

        if (data.status === 'DONE') {
            bookings
                ?.filter((booking) => booking.status === 'ACCEPTED')
                .reduce<string[]>((usersId, booking) => {
                    return [...usersId, booking.user.id]
                }, [])
                .forEach(async (userId) => {
                    const { tripsAsPassenger } =
                        await usersService.findUserById(userId)
                    usersService.updateUser({
                        id: userId,
                        tripsAsPassenger: tripsAsPassenger + 1,
                    })
                })
        }

        const { tripsAsDriver } = await usersService.findUserById(
            journeyUser.id
        )

        usersService.updateUser({
            id: journeyUser.id,
            tripsAsDriver: tripsAsDriver + 1,
        })

        return await new JourneysService().updateJourney(data)
    }
}
