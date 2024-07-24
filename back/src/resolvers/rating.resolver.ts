import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateRatingInput, RatingEntity } from '../entities/rating.entity'
import { MyContext } from '..'
import { userAuthorized } from '../utils/userAuthorized'

@Resolver()
export default class RatingResolver {
    @Query(() => [RatingEntity])
    async listRatingsByUser(
        @Arg('userRatedId') userRatedId: string,
        @Ctx() { ratingsService }: MyContext
    ) {
        return await ratingsService.listRatingsByUser(userRatedId)
    }

    @Authorized()
    @Mutation(() => RatingEntity)
    async createRating(
        @Arg('data') data: CreateRatingInput,
        @Ctx() { user: userCtx, bookingService, ratingsService }: MyContext
    ): Promise<RatingEntity> {
        const {
            booking: { id },
        } = data

        const {
            user: { id: raterId },
        } = await bookingService.findBookingById(id)

        userAuthorized([raterId], userCtx)

        return await ratingsService.createRatingAndUpdateAverage(data)
    }
}
