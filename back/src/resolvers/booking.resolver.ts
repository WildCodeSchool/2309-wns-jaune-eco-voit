import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import BookingService from '../services/bookings.service'
import { BookingEntity, CreateBookingInput } from '../entities/booking.entity'
import { MyContext } from '..'
import UsersService from '../services/users.service'
import JourneysService from '../services/journeys.service'

@Resolver(() => BookingEntity)
export default class BookingResolver {
    @Query(() => [BookingEntity])
    async listBookings() {
        const bookings = await new BookingService().listBookings()

        if (!bookings) {
            throw new Error('No data found')
        }
        return bookings
    }

    @Query(() => BookingEntity)
    async findBookingById(@Arg('id') id: string) {
        return await new BookingService().findBookingById(id)
    }

    @Query(() => [BookingEntity])
    async listBookingsByUser(
        @Arg('userId') userId: string,
        @Ctx() { req, res, user }: MyContext
    ) {
        // On vérifie l'id envoyé en argument correspond bien à un user existant
        // Si ce n'est pas le cas, une erreur sera envoyé directement depuis la méthode findUserById du userService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que le user existe
        await new UsersService().findUserById(userId)

        // On vérifie que le user envoyé par le context est bien présent
        if (!user) throw new Error('Veuillez vous connecter')

        // On vérifie que l'id du user envoyé par le context correspond à l'id envoyé en arg
        if (user?.id !== userId) throw new Error('Accès impossible')

        return await new BookingService().listBookingsFilter({
            userId,
        })
    }

    @Query(() => [BookingEntity])
    async listBookingsByJourney(@Arg('journeyId') journeyId: string) {
        // On vérifie que la journeyId envoyé existe
        // Si ce n'est pas le cas, l'erreur sera envoyé directement depuis la fonciton findJourneyById du JourneysService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que la journey existe

        await new JourneysService().findJourneyById(journeyId)
        return await new BookingService().listBookingsFilter({
            journeyId,
        })
    }

    @Mutation(() => BookingEntity)
    async createBooking(@Arg('data') data: CreateBookingInput) {
        return new BookingService().create(data)
    }

    @Mutation(() => BookingEntity)
    async acceptBooking(@Arg('id') id: string) {
        return await new BookingService().updateBooking(id, {
            status: 'ACCEPTED',
        })
    }

    @Mutation(() => BookingEntity)
    async rejectBooking(@Arg('id') id: string) {
        return await new BookingService().updateBooking(id, {
            status: 'REJECTED',
        })
    }

    @Mutation(() => BookingEntity)
    async cancelBooking(@Arg('id') id: string) {
        return await new BookingService().updateBooking(id, {
            status: 'CANCELLED',
        })
    }
}
