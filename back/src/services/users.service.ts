import { Repository } from 'typeorm'
import datasource from '../db'
import { validate } from 'class-validator'
import {
    CreateUserInput,
    UpdateUserInput,
    UserEntity,
} from '../entities/user.entity'

export default class UsersService {
    db: Repository<UserEntity>

    constructor() {
        this.db = datasource.getRepository(UserEntity)
    }

    async listUser() {
        return await this.db.find({
            relations: {
                bookings: true,
                journeys: true,
            },
        })
    }

    async findUserById(id: string) {
        return await this.db.findOne({
            where: { id },
            relations: { bookings: true, journeys: true },
        })
    }

    async findUserByEmail(email: string) {
        return await this.db.findOne({
            where: { email },
            relations: { bookings: true, journeys: true },
        })
    }

    async create(body: CreateUserInput) {
        const newUser: UserEntity = this.db.create(body)

        const errors = await validate(newUser)
        if (errors.length !== 0) {
            console.log(errors)
            throw new Error('Something wrong with the body validation')
        }
        return await this.db.save(newUser)
    }

    async updateUser(id: string, body: UpdateUserInput) {
        const userToUpdate = await this.db.findOneBy({ id })

        if (!userToUpdate) {
            throw new Error('User not found')
        }

        const userUpdated = this.db.merge(userToUpdate, body)
        const errors = await validate(userUpdated)

        if (errors.length !== 0) {
            throw new Error('Something wrong with the body validation')
        }

        await this.db.save(userUpdated)

        return await this.db.findOne({
            where: { id },
            relations: { journeys: true, bookings: true },
        })
    }
}
