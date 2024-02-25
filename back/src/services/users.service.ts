import { Repository } from 'typeorm'
import datasource from '../db'
import {
    CreateUserInput,
    UpdateUserInput,
    UserEntity,
} from '../entities/user.entity'
import { assertDataExists, validateData } from '../utils/errorHandlers'

const relations = { journeys: true, bookings: true }

export default class UsersService {
    db: Repository<UserEntity>

    constructor() {
        this.db = datasource.getRepository(UserEntity)
    }

    async listUser() {
        return await this.db.find({
            relations,
        })
    }

    async findUserById(id: string) {
        const user = await this.db.findOne({
            where: { id },
            relations,
        })

        assertDataExists(user)

        return user as UserEntity
    }

    async findUserByEmail(email: string) {
        const user = await this.db.findOne({
            where: { email },
            relations,
        })

        assertDataExists(user)

        return user
    }

    // Fonction créé parce qu'ici on ne renvoie pas d'erreur sur le user n'est pas trouvé
    // Car cette fonction est appelé dans le middleware express dans index.ts
    async findUserByEmailForJWT(email: string) {
        const user = await this.db.findOne({
            where: { email },
            relations,
        })

        return user as UserEntity
    }

    async create(body: CreateUserInput) {
        const doesUserExists = await this.findUserByEmail(body.email)
        if (doesUserExists) throw new Error('This email is already used')

        const newUser: UserEntity = this.db.create(body)

        validateData(newUser)

        return await this.db.save(newUser)
    }

    async updateUser({ id, ...body }: UpdateUserInput) {
        const userToUpdate = await this.findUserById(id)

        const userUpdated = this.db.merge(userToUpdate, body)

        validateData(userUpdated)

        return this.db.save(userUpdated)
    }
}
