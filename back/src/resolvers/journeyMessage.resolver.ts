import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import {
    CreateJourneyMessageInput,
    JourneyMessageEntity,
} from '../entities/journeyMessage.entity'
import { MyContext } from '..'
import { userAuthorized } from '../utils/userAuthorized'

@Resolver()
export default class JourneyMessageResolver {
    @Query(() => [JourneyMessageEntity])
    async listJourneyMessagesByJourney(
        @Arg('journeyId') journeyId: string,
        @Ctx() { journeyMessageService }: MyContext
    ) {
        return await journeyMessageService.listJourneyMessagesByJourney(
            journeyId
        )
    }

    @Authorized()
    @Mutation(() => JourneyMessageEntity)
    async createJourneyMessage(
        @Arg('data') data: CreateJourneyMessageInput,
        @Ctx() { user: userCtx, journeyMessageService }: MyContext
    ): Promise<JourneyMessageEntity> {
        userAuthorized([data.user.id], userCtx)

        return await journeyMessageService.createJourneyMessage(data)
    }

    @Authorized(['ADMIN'])
    @Mutation(() => JourneyMessageEntity)
    async deleteJourneyMessage(
        @Arg('id') id: string,
        @Ctx() { journeyMessageService }: MyContext
    ) {
        await journeyMessageService.deleteJourneyMessage(id)
    }
}
