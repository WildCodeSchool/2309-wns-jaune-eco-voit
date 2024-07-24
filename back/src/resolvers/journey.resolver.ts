import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import {
    JourneyEntity,
    CreateJourneyInput,
    UpdateJourneyInput,
    UpdateJourneyStatusInput,
    ListJourneysWithFilters,
} from '../entities/journey.entity'
import { MyContext } from '..'
import { userAuthorized } from '../utils/userAuthorized'

@Resolver()
export default class JourneyResolver {
    @Query(() => [JourneyEntity])
    async listJourneys(
        @Ctx() { journeyService }: MyContext,
        @Arg('filters', { nullable: true }) filters?: ListJourneysWithFilters
    ) {
        return await journeyService.listJourneys(filters)
    }

    @Query(() => JourneyEntity)
    async findJourneyById(
        @Ctx() { journeyService }: MyContext,
        @Arg('id') id: string
    ) {
        return await journeyService.findJourneyById(id)
    }

    @Authorized()
    @Query(() => [JourneyEntity])
    async listJourneysByUser(
        @Arg('userId') userId: string,
        @Ctx() { user, journeyService }: MyContext
    ) {
        userAuthorized([userId], user)

        return await journeyService.listJourneysByUser(userId)
    }

    @Authorized()
    @Mutation(() => JourneyEntity)
    async createJourney(
        @Arg('data') data: CreateJourneyInput,
        @Ctx() { user, journeyService }: MyContext
    ) {
        userAuthorized([data.user.id], user)

        return await journeyService.createJourney(data)
    }

    @Authorized()
    @Mutation(() => JourneyEntity)
    async updateJourney(
        @Arg('data') data: UpdateJourneyInput,
        @Ctx() { user, journeyService }: MyContext
    ) {
        const {
            user: { id: driverId },
        } = await journeyService.findJourneyById(data.id)

        userAuthorized([driverId], user)

        return await journeyService.updateJourney(data)
    }

    @Authorized()
    @Mutation(() => JourneyEntity)
    async updateJourneyStatus(
        @Arg('data') data: UpdateJourneyStatusInput,
        @Ctx() { user, journeyService }: MyContext
    ): Promise<JourneyEntity> {
        const {
            user: { id: driverId },
        } = await journeyService.findJourneyById(data.id)

        userAuthorized([driverId], user)

        return await journeyService.updateJourneyStatus(data)
    }
}
