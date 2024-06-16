import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import {
    CreateJourneyMessageInput,
    JourneyMessageEntity,
} from '../entities/journeyMessage.entity'
import { MyContext } from '..'

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
        return await journeyMessageService.createJourneyMessage({
            data,
            userCtxId: userCtx?.id ?? '',
        })
    }
}
