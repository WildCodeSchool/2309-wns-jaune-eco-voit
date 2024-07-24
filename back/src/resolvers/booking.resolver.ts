import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { BookingEntity, CreateBookingInput } from '../entities/booking.entity'
import { MyContext } from '..'
import { userAuthorized } from '../utils/userAuthorized'

@Resolver(() => BookingEntity)
export default class BookingResolver {
    @Authorized(['ADMIN'])
    @Query(() => [BookingEntity])
    async listBookings(@Ctx() { bookingService }: MyContext) {
        return await bookingService.listBookings()
    }

    @Authorized()
    @Query(() => BookingEntity)
    async findBookingById(
        @Arg('id') id: string,
        @Ctx() { user, bookingService }: MyContext
    ) {
        const booking = await bookingService.findBookingById(id)
        const {
            user: passenger,
            journey: { user: driver },
        } = booking

        userAuthorized([passenger.id, driver.id], user)

        return booking
    }

    @Authorized()
    @Query(() => [BookingEntity])
    async listBookingsByUser(
        @Arg('userId') userId: string,
        @Ctx() { user, bookingService }: MyContext
    ) {
        userAuthorized([userId], user)

        return await bookingService.listBookingsFilter({
            userId,
        })
    }

    @Authorized()
    @Query(() => [BookingEntity])
    async listBookingsByJourney(
        @Arg('journeyId') journeyId: string,
        @Ctx() { user, journeyService, bookingService }: MyContext
    ) {
        const {
            user: { id: driverId },
            bookings = [],
        } = await journeyService.findJourneyById(journeyId)

        const passengersId = bookings?.map((booking) => booking.id)

        userAuthorized([driverId, ...passengersId], user)

        return await bookingService.listBookingsFilter({
            journeyId,
        })
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async createBooking(
        @Arg('data') data: CreateBookingInput,
        @Ctx() { user, bookingService }: MyContext
    ): Promise<BookingEntity> {
        userAuthorized([data.user.id], user)

        return await bookingService.createBooking(data)
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async acceptBooking(
        @Arg('id') id: string,
        @Ctx() { user: userCtx, bookingService, journeyService }: MyContext
    ): Promise<BookingEntity> {
        const {
            user: { id: driverId },
        } = await journeyService.findJourneyByBookingId(id)

        userAuthorized([driverId], userCtx)

        return await bookingService.acceptBooking(id)
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async rejectBooking(
        @Arg('id') id: string,
        @Ctx() { user: userCtx, bookingService, journeyService }: MyContext
    ): Promise<BookingEntity> {
        const {
            user: { id: driverId },
        } = await journeyService.findJourneyByBookingId(id)

        userAuthorized([driverId], userCtx)

        return await bookingService.rejectBooking(id)
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async cancelBooking(
        @Arg('id') id: string,
        @Ctx() { user: userCtx, bookingService }: MyContext
    ): Promise<BookingEntity> {
        const {
            user: { id: passengerId },
        } = await bookingService.findBookingById(id)

        userAuthorized([passengerId], userCtx)
        return await bookingService.cancelBooking(id)
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async bookingPaid(
        @Arg('id') id: string,
        @Ctx() { user: userCtx, bookingService }: MyContext
    ): Promise<BookingEntity> {
        const {
            user: { id: passengerId },
        } = await bookingService.findBookingById(id)

        userAuthorized([passengerId], userCtx)
        return await bookingService.bookingPaid(id)
    }
}
