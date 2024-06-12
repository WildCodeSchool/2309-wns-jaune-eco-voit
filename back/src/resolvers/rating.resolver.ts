import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateRatingInput, RatingEntity } from '../entities/rating.entity'
import RatingsService from '../services/ratings.service'
import { MyContext } from '..'
import { userAuthorized } from '../utils/userAuthorized'
import BookingsService from '../services/bookings.service'
import UsersService from '../services/users.service'

@Resolver()
export default class RatingResolver {
    @Query(() => [RatingEntity])
    async listRatingsByUser(@Arg('userRatedId') userRatedId: string) {
        return await new RatingsService().listRatingsByUser(userRatedId)
    }

    @Authorized()
    @Mutation(() => RatingEntity)
    async createRating(
        @Arg('data') { booking, userRated, rate }: CreateRatingInput,
        @Ctx() { user: userCtx }: MyContext
    ) {
        const ratingService = new RatingsService()
        const bookingService = new BookingsService()

        const { user: rater, status } = await bookingService.findBookingById(
            booking.id
        )

        const isBookingRated = await ratingService.findRatingByBooking(
            booking.id
        )

        userAuthorized([rater.id], userCtx)

        if (status !== 'DONE') {
            throw new Error('Booking is not done')
        }

        if (isBookingRated) {
            throw new Error('Booking already rated')
        }

        const newRating = await ratingService.createRating({
            booking,
            rate,
            userRated,
        })

        const userRatings = await ratingService.listRatingsByUser(userRated.id)

        const newAverageRate = parseFloat(
            (
                userRatings.reduce((acc, curr) => acc + Number(curr.rate), 0) /
                userRatings.length
            ).toFixed(2)
        )

        await bookingService.updateBooking(booking.id, { status: 'RATED' })

        await new UsersService().updateAverageRate({
            userId: userRated.id,
            newAverageRate: newAverageRate,
        })

        return newRating
    }
}
