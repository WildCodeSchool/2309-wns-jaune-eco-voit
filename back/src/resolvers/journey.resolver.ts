import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import JourneysService from '../services/journeys.service'

import {
    JourneyEntity,
    CreateJourneyInput,
    UpdateJourneyInput,
    UpdateJourneyStatusInput,
} from '../entities/journey.entity'

@Resolver()
export class JourneyResolver {
    // LIST ALL JOURNEYS
    @Query(() => [JourneyEntity])
    async listJourneys() {
        return await new JourneysService().listJourneys()
    }

    // FIND JOURNEY BY ID
    @Query(() => JourneyEntity)
    async findJourneyById(@Arg('id') id: string) {
        const journey = await new JourneysService().findJourneyById(id)
        if (!journey) {
            throw new Error('Journey not found')
        }
        return journey
    }

    // CREATE JOURNEY
    @Mutation(() => JourneyEntity)
    async createJourney(@Arg('data') data: CreateJourneyInput) {
        return await new JourneysService().createJourney(data)
    }

    // UPDATE JOURNEY
    @Mutation(() => JourneyEntity)
    async updateJourney(@Arg('data') data: UpdateJourneyInput) {
        return await new JourneysService().updateJourney(data)
    }

    // UPDATE JOURNEY STATUS
    @Mutation(() => JourneyEntity)
    async decreaseAvailableSeats(@Arg('id') id: string) {
        const journey = await new JourneysService().findJourneyById(id)
        return await new JourneysService().updateJourney({
            id,
            availableSeats: journey.availableSeats - 1,
        })
    }

    @Mutation(() => JourneyEntity)
    async updateJourneyStatus(@Arg('data') data: UpdateJourneyStatusInput) {
        const { id, status } = data
        return await new JourneysService().updateJourneyStatus(id, status)
    }
}
