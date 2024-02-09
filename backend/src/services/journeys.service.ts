import { Repository } from 'typeorm'

import DataSource from '../db'
import {
    JourneyEntity,
    CreateJourneyInput,
    UpdateJourneyInput,
    JourneyStatus,
} from '../entities/journey.entity'
import { validate } from 'class-validator'

export default class JourneysService {
    db: Repository<JourneyEntity>
    constructor() {
        this.db = DataSource.getRepository(JourneyEntity)
    }

    async findJourneyById(id: string) {
        const journey = await this.db.findOneBy({ id })
        if (!journey) {
            throw new Error('Journey not found')
        }
        return journey
    }

    async listJourneys() {
        return await this.db.find()
    }

    async listJourneysByUser(id: string) {
        return await this.db.find({ where: { user: { id } } })
    }

    async createJourney(data: CreateJourneyInput) {
        const journey = this.db.create(data)
        return await this.db.save(journey)
    }

    async updateJourney(data: UpdateJourneyInput) {
        const { id, ...infos } = data
        const journeyToUpdate = await this.findJourneyById(id)
        if (!journeyToUpdate) {
            throw new Error('Journey not found')
        }

        const journeyToSave = this.db.merge(journeyToUpdate, infos)

        const errors = await validate(journeyToSave)
        if (errors.length > 0) {
            console.log(errors)
            throw new Error('Journey Update Validation failed')
        }
        return await this.db.save(journeyToUpdate)
    }

    async updateJourneyStatus(id: string, status: JourneyStatus) {
        const journey = await this.findJourneyById(id)
        journey.status = status
        return this.db.save(journey)
    }
}
