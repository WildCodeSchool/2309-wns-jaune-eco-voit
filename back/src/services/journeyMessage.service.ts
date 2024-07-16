import { Repository } from 'typeorm'
import {
    CreateJourneyMessageInput,
    JourneyMessageEntity,
} from '../entities/journeyMessage.entity'

import datasource from '../db'
import { assertDataExists } from '../utils/errorHandlers'
import JourneyService from './journey.service'

export default class JourneyMessageService {
    db: Repository<JourneyMessageEntity>

    constructor() {
        this.db =
            // process.env.NODE_ENV === 'test'
            //     ? datasourceTest.getRepository(JourneyMessageEntity)
            datasource.getRepository(JourneyMessageEntity)
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

    async createJourneyMessage(
        data: CreateJourneyMessageInput
    ): Promise<JourneyMessageEntity> {
        const journeyService = new JourneyService()

        const {
            user: { id: userId },
            journey: { id: journeyId },
        } = data

        const journeyData = await journeyService.findJourneyById(journeyId)

        if (!journeyData) {
            throw new Error('Journey not found')
        }

        const { user: driver, bookings: journeyBookings } = journeyData

        const isDriver = driver && driver.id === userId

        const isPassenger = journeyBookings?.some(
            ({ user: { id: bookingUserId } }) => bookingUserId === userId
        )

        if (!isDriver && !isPassenger) {
            throw new Error('Accès non autorisé')
        }

        const journeyMessage = this.db.create(data)

        return await this.db.save(journeyMessage)
    }

    async deleteJourneyMessage(id: string) {
        await this.db.delete(id)
    }
}
