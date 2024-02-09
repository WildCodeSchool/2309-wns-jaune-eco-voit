import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import JourneysService from '../services/journeys.service'

import {
    JourneyEntity,
    CreateJourneyInput,
    UpdateJourneyInput,
    UpdateJourneyStatusInput,
} from '../entities/journey.entity'

// Ajouter listJourneysByUser

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
        // A terme il faudra vérifier qu'aucun booking n'existe sur cette journey

        return await new JourneysService().updateJourney(data)
    }

    // UPDATE JOURNEY STATUS
    @Mutation(() => JourneyEntity)
    async updateJourneyStatus(@Arg('data') data: UpdateJourneyStatusInput) {
        const { id, status } = data
        return await new JourneysService().updateJourneyStatus(id, status)
    }
}
