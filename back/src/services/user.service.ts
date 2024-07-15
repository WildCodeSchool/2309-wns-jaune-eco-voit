import { Repository } from 'typeorm'
import datasource from '../db'
import datasourceTest from '../db_test'
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

export default class UserService {
    db: Repository<UserEntity>

    constructor() {
        this.db =
            process.env.NODE_ENV === 'test'
                ? datasourceTest.getRepository(UserEntity)
                : datasource.getRepository(UserEntity)
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
    }: LoginInput): Promise<{ user: UserEntity; token: string } | null> {
        const user = await this.findUserByEmailWitoutAsserting(email)

        if (!user) {
            throw new Error('Vérifiez vos informations')
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
            relations: { journeys: true, bookings: true, ratings: true },
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
}
