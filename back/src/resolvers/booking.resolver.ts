import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql'
import BookingService from '../services/bookings.service'
import { BookingEntity, CreateBookingInput } from '../entities/booking.entity'

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
        const booking = await new BookingService().findBookingById(id)
        if (!booking) throw new Error('No data found')
        return booking
    }

    @Query(() => [BookingEntity])
    async findBookingByUser(@Arg('id') id: string) {
        const bookings = await new BookingService().listBookingsFilter({
            userId: id,
        })
        if (!bookings) throw new Error('No data found')
        return bookings
    }

    @Query(() => [BookingEntity])
    async findBookingByJourney(@Arg('id') id: string) {
        const bookings = await new BookingService().listBookingsFilter({
            journeyId: id,
        })
        if (!bookings) throw new Error('No data found')
        return bookings
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
