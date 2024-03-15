import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import BookingService from '../services/bookings.service'
import { BookingEntity, CreateBookingInput } from '../entities/booking.entity'
import { MyContext } from '..'
import UsersService from '../services/users.service'
import JourneysService from '../services/journeys.service'
import { userAuthorized } from '../utils/userAuthorized'

@Resolver(() => BookingEntity)
export default class BookingResolver {
    @Authorized(['ADMIN'])
    @Query(() => [BookingEntity])
    async listBookings() {
        return await new BookingService().listBookings()
    }

    @Authorized()
    @Query(() => BookingEntity)
    async findBookingById(@Arg('id') id: string, @Ctx() { user }: MyContext) {
        const booking = await new BookingService().findBookingById(id)
        userAuthorized([booking.user.id, booking.journey.user.id], user)
        return booking
    }

    @Authorized()
    @Query(() => [BookingEntity])
    async listBookingsByUser(
        @Arg('userId') userId: string,
        @Ctx() { user }: MyContext
    ) {
        // On vérifie l'id envoyé en argument correspond bien à un user existant dans la DB
        // Si ce n'est pas le cas, une erreur sera envoyé directement depuis la méthode findUserById du userService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que le user existe
        await new UsersService().findUserById(userId)

        // On vérifie que l'id du user envoyé par le context correspond à l'id envoyé en arg
        userAuthorized([userId], user)

        return await new BookingService().listBookingsFilter({
            userId,
        })
    }

    @Authorized()
    @Query(() => [BookingEntity])
    async listBookingsByJourney(
        @Arg('journeyId') journeyId: string,
        @Ctx() { user }: MyContext
    ) {
        // On vérifie que la journeyId envoyé existe
        // Si ce n'est pas le cas, l'erreur sera envoyé directement depuis la fonciton findJourneyById du JourneysService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que la journey existe
        const { status: journeyStatus, user: journeyUser } =
            await new JourneysService().findJourneyById(journeyId)

        const bookings = await new BookingService().listBookingsFilter({
            journeyId,
        })

        if (user?.role === 'ADMIN' || journeyUser.id === user?.id) {
            return bookings
        } else {
            if (journeyStatus === 'PLANNED') {
                return bookings.filter(
                    (booking) => booking.status === 'ACCEPTED'
                )
            } else {
                throw new Error('Access denied')
            }
        }
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async createBooking(
        @Arg('data') data: CreateBookingInput,
        @Ctx() { user }: MyContext
    ) {
        userAuthorized([data.user.id], user)

        const journeyService = new JourneysService()
        const { availableSeats, automaticAccept } =
            await journeyService.findJourneyById(data.journey.id)

        if (availableSeats <= 0)
            throw new Error('No available seats for this journey')

        const newBooking = new BookingService().createBooking({
            ...data,
            status: automaticAccept ? 'ACCEPTED' : 'PENDING',
        })

        automaticAccept &&
            (await journeyService.updateJourney({
                id: data.journey.id,
                availableSeats: availableSeats - 1,
            }))

        return newBooking
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async acceptBooking(@Arg('id') id: string, @Ctx() { user }: MyContext) {
        const bookingService = new BookingService()

        const { journey } = await bookingService.findBookingById(id)

        const { user: journeyUser } =
            await new JourneysService().findJourneyById(journey.id)

        userAuthorized([journeyUser.id], user)

        if (journey.availableSeats <= 0)
            throw new Error('No available seats for this journey')

        console.log('ok2')

        await new JourneysService().updateJourney({
            id: journey.id,
            availableSeats: journey.availableSeats - 1,
        })

        return await bookingService.updateBooking(id, {
            status: 'ACCEPTED',
        })
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async rejectBooking(@Arg('id') id: string, @Ctx() { user }: MyContext) {
        const bookingService = new BookingService()

        const { journey } = await bookingService.findBookingById(id)

        const { user: journeyUser } =
            await new JourneysService().findJourneyById(journey.id)

        userAuthorized([journeyUser.id], user)

        return await bookingService.updateBooking(id, {
            status: 'REJECTED',
        })
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async cancelBooking(@Arg('id') id: string, @Ctx() { user }: MyContext) {
        const bookingService = new BookingService()

        const { journey, user: userBooking } =
            await bookingService.findBookingById(id)

        userAuthorized([userBooking.id], user)

        await new JourneysService().updateJourney({
            id: journey.id,
            availableSeats: journey.availableSeats + 1,
        })

        return await new BookingService().updateBooking(id, {
            status: 'CANCELLED',
        })
    }
}
