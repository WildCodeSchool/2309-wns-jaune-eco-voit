import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import JourneysService from '../services/journeys.service'

import {
    JourneyEntity,
    CreateJourneyInput,
    UpdateJourneyInput,
    UpdateJourneyStatusInput,
} from '../entities/journey.entity'
import UsersService from '../services/users.service'

@Resolver()
export class JourneyResolver {
    @Query(() => [JourneyEntity])
    async listJourneys() {
        return await new JourneysService().listJourneys()
    }

    @Query(() => JourneyEntity)
    async findJourneyById(@Arg('id') id: string) {
        return await new JourneysService().findJourneyById(id)
    }

    @Query(() => [JourneyEntity])
    async listJourneysByUser(@Arg('userId') userId: string) {
        // On vérifie l'id envoyé en argument correspond bien à un user existant
        // Si ce n'est pas le cas, une erreur sera envoyé directement depuis la méthode findUserById du userService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que le user existe
        await new UsersService().findUserById(userId)
        return await new JourneysService().listJourneysFilter({
            userId,
        })
    }

    @Mutation(() => JourneyEntity)
    async createJourney(@Arg('data') data: CreateJourneyInput) {
        return await new JourneysService().createJourney(data)
    }

    @Mutation(() => JourneyEntity)
    async updateJourney(@Arg('data') data: UpdateJourneyInput) {
        return await new JourneysService().updateJourney(data)
    }

    @Mutation(() => JourneyEntity)
    async decreaseAvailableSeats(@Arg('id') id: string) {
        const { availableSeats } = await new JourneysService().findJourneyById(
            id
        )
        return await new JourneysService().updateJourney({
            id,
            availableSeats: availableSeats - 1,
        })
    }

    @Mutation(() => JourneyEntity)
    async increaseAvailableSeats(@Arg('id') id: string) {
        const { availableSeats } = await new JourneysService().findJourneyById(
            id
        )
        return await new JourneysService().updateJourney({
            id,
            availableSeats: availableSeats + 1,
        })
    }

    @Mutation(() => JourneyEntity)
    async updateJourneyStatus(@Arg('data') data: UpdateJourneyStatusInput) {
        return await new JourneysService().updateJourney(data)
    }
}
