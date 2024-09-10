import { Repository } from 'typeorm'
import datasource from '../db'
import {
    CreateUserInput,
    LoginInput,
    UpdateUserInput,
    UpdateUserPasswordInput,
    UserEntity,
} from '../entities/user.entity'
import { assertDataExists, validateData } from '../utils/errorHandlers'
import argon2 from 'argon2'
import { SignJWT } from 'jose'
import BookingService from './booking.service'
import JourneyService from './journey.service'

export default class UserService {
    db: Repository<UserEntity>

    constructor() {
        this.db = datasource.getRepository(UserEntity)
    }

    public getDriverNewGrade = (
        tripsAsDriver: number
    ): 'BEGINNER' | 'CONFIRMED' | 'AMBASSADOR' => {
        if (tripsAsDriver < 5) {
            return 'BEGINNER'
        } else if (tripsAsDriver >= 5 && tripsAsDriver < 10) {
            return 'CONFIRMED'
        } else {
            return 'AMBASSADOR'
        }
    }

    // Fonction créée parce qu'on a besoin d'un findUserByEmail qui ne renvoie pas d'erreur si le user n'existe pas, pour:
    // L'appel de la fonction dans le middleware express dans index.ts utilisé pour le JWT
    // La création d'une nouveau user, on doit vérifier justement qu'il n'existe pas donc il ne faut pas renvoyer d'erreur si c'est le cas
    async findUserByEmailWitoutAsserting(
        email: string
    ): Promise<UserEntity | null> {
        return await this.db.findOne({
            where: { email },
        })
    }

    async login({
        email,
        password,
    }: LoginInput): Promise<{ user: UserEntity; token: string }> {
        const user = await this.findUserByEmailWitoutAsserting(email)
        console.log(user)

        if (!user) {
            throw new Error('Vérifiez vos informations')
        }

        if (user.status === 'ARCHIVED') {
            throw new Error('Ce compte à été désactivé')
        }

        const isPasswordValid = await argon2.verify(user.password, password)

        if (!isPasswordValid) {
            throw new Error('Vérifiez vos informations')
        }

        const token = await new SignJWT({
            email,
            role: user.role,
            id: user.id,
        })
            .setProtectedHeader({
                alg: 'HS256',
                typ: 'jwt',
            })
            .setExpirationTime('2 h')
            .sign(new TextEncoder().encode(`${process.env.SECRET_KEY}`))

        return { user, token }
    }

    async updateUser({ id, ...body }: UpdateUserInput): Promise<UserEntity> {
        const userToUpdate = await this.findUserById(id)
        if (!userToUpdate) {
            throw new Error('User not found')
        }
        const userUpdated = this.db.merge(userToUpdate, body)

        await validateData(userUpdated)

        return this.db.save(userUpdated)
    }

    async updateUserPassword(
        data: UpdateUserPasswordInput
    ): Promise<UserEntity> {
        const { id, oldPassword, newPassword } = data

        const user = await this.findUserById(id)

        if (!user) {
            throw new Error('User not found')
        }

        const isPasswordValid = await argon2.verify(user.password, oldPassword)

        if (!isPasswordValid) {
            throw new Error('Old password is invalid')
        }

        return await this.updateUser({ id, password: newPassword })
    }

    async listUser(): Promise<UserEntity[]> {
        return await this.db.find({
            relations: { journeys: true, bookings: true, ratings: true },
        })
    }

    async findUserById(id: string): Promise<UserEntity> {
        const user = await this.db.findOne({
            where: { id },
            relations: ['journeys', 'bookings', 'ratings'],
        })

        assertDataExists(user)

        return user as UserEntity
    }

    async create(body: CreateUserInput): Promise<UserEntity> {
        const userExists = await this.findUserByEmailWitoutAsserting(body.email)

        if (userExists) throw new Error('Cet email est déjà utilisé')

        const newUser = this.db.create(body)

        await validateData(newUser)

        return await this.db.save(newUser)
    }

    async updateAverageRate(data: { id: string; averageRate: number }) {
        await this.updateUser(data)
    }

    async archiveUser(id: string): Promise<UserEntity> {
        const bookingService = new BookingService()
        const journeyService = new JourneyService()

        const userToArchive = await this.findUserById(id)
        assertDataExists(userToArchive)

        const { bookings, journeys } = userToArchive

        if (bookings && bookings.length) {
            bookings.forEach(({ status, id: bookingId }) => {
                if (status === 'PENDING' || status === 'ACCEPTED') {
                    bookingService.cancelBooking(bookingId)
                }
            })
        }

        if (journeys && journeys.length) {
            journeys.forEach((journey) => {
                if (journey.status === 'PLANNED') {
                    journeyService.updateJourneyStatus({
                        id: journey.id,
                        status: 'CANCELLED',
                    })
                }
            })
        }
        return await this.updateUser({ id, status: 'ARCHIVED' })
    }

    async unarchiveUser(id: string): Promise<UserEntity> {
        const userToUnarchive = await this.findUserById(id)
        assertDataExists(userToUnarchive)

        return await this.updateUser({ id, status: 'ACTIVE' })
    }
}
