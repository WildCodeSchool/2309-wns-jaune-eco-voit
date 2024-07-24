import JourneysService from '../services/journey.service'

const journeyService = new JourneysService()

export const handleJourneysDone = async () => {
    const journeys = await journeyService.listJourneysForScheduler()

    journeys.forEach(async ({ id }) => {
        await journeyService.updateJourneyStatus({ id, status: 'DONE' })
    })
}
