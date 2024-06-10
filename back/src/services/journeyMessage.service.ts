import { Repository } from 'typeorm'
import {
    CreateJourneyMessageInput,
    JourneyMessageEntity,
} from '../entities/journeyMessage.entity'

import datasource from '../db'
import { assertDataExists, validateData } from '../utils/errorHandlers'

export default class JourneyMessageService {
    db: Repository<JourneyMessageEntity>

    constructor() {
        this.db = datasource.getRepository(JourneyMessageEntity)
    }

    async listJourneyMessagesByJourney(journeyId: string) {
        const journeys = await this.db.find({
            relations: { user: true, journey: true },
            where: {
                journey: { id: journeyId },
            },
        })

        return journeys.sort((a, b) => {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            return dateA.getTime() - dateB.getTime()
        })
    }

    async findMessageById(id: string) {
        const message = await this.db.findOne({
            where: { id },
            relations: { user: true, journey: true },
        })

        assertDataExists(message)

        return message as JourneyMessageEntity
    }

    async createJourneyMessage(data: CreateJourneyMessageInput) {
        const newMessage: JourneyMessageEntity = this.db.create(data)

        await validateData(newMessage)

        const messageSaved = await this.db.save(newMessage)

        return this.findMessageById(messageSaved.id)
    }
}
