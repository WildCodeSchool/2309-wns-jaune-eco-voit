import { Repository } from 'typeorm'

import DataSource from '../db'
import {
    JourneyEntity,
    CreateJourneyInput,
    UpdateJourneyInput,
} from '../entities/journey.entity'
import { validateData, assertDataExists } from '../utils/errorHandlers'

const relations = { user: true, booking: true }

export default class JourneysService {
    db: Repository<JourneyEntity>
    constructor() {
        this.db = DataSource.getRepository(JourneyEntity)
    }

    async findJourneyById(id: string) {
        const journey = await this.db.findOne({
            where: { id },
            relations,
        })

        assertDataExists(journey)

        return journey as JourneyEntity
    }

    async listJourneys() {
        return await this.db.find({ relations })
    }

    async listJourneysFilter({ userId }: { userId?: string }) {
        return await this.db.find({
            where: {
                user: { id: userId ?? undefined },
            },
            relations,
        })
    }

    async createJourney(data: CreateJourneyInput) {
        const newJourney: JourneyEntity = this.db.create(data)

        await validateData(newJourney)

        const journeySaved = await this.db.save(newJourney)

        return this.findJourneyById(journeySaved.id)
    }

    async updateJourney({ id, ...body }: UpdateJourneyInput) {
        const journeyToUpdate = await this.findJourneyById(id)

        const journeyToSave = this.db.merge(journeyToUpdate, body)

        await validateData(journeyToSave)

        return await this.db.save(journeyToUpdate)
    }
}
