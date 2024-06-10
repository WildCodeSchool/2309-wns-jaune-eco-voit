import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import JourneyMessageService from '../services/journeyMessage.service'
import {
    CreateJourneyMessageInput,
    JourneyMessageEntity,
} from '../entities/journeyMessage.entity'
import { MyContext } from '..'
import JourneysService from '../services/journeys.service'
import UsersService from '../services/users.service'
import { BookingEntity } from '../entities/booking.entity'

@Resolver()
export default class JourneyMessageResolver {
    @Query(() => [JourneyMessageEntity])
    async listJourneyMessagesByJourney(@Arg('journeyId') journeyId: string) {
        return await new JourneyMessageService().listJourneyMessagesByJourney(
            journeyId
        )
    }

    @Authorized()
    @Mutation(() => JourneyMessageEntity)
    async createJourneyMessage(
        @Arg('data') { user, journey, message }: CreateJourneyMessageInput,
        @Ctx() { user: userCtx }: MyContext
    ) {
        const journeyData = await new JourneysService().findJourneyById(
            journey.id
        )

        if (!journeyData) {
            throw new Error('Journey not found')
        }

        const { user: driver, bookings: journeyBookings } = journeyData

        const isDriver = driver && driver.id === userCtx?.id

        const { bookings: userBookings } =
            await new UsersService().findUserById(userCtx?.id || '')

        const journeyBookingIds = new Set(
            journeyBookings?.map((booking: BookingEntity) => booking.id)
        )
        const userisPassenger = userBookings?.some((booking) =>
            journeyBookingIds.has(booking.id)
        )

        if (!isDriver && !userisPassenger) {
            throw new Error('Accès non autorisé')
        }

        return await new JourneyMessageService().createJourneyMessage({
            user,
            journey,
            message,
        })
    }
}
