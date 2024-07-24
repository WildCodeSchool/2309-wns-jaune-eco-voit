import { JourneyEntity } from '../../../src/entities/journey.entity'

export type ResponseCreateJourney = {
    createJourney: JourneyEntity
}

export type ResponseListJourneys = {
    listJourneys: JourneyEntity[]
}

export type ResponseFindJourneyById = {
    findJourneyById: JourneyEntity
}
