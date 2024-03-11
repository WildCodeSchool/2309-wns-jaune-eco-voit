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

        return user as UserEntity
    }

    // Fonction créée parce qu'on a besoin d'un findUserByEmail qui ne renvoie pas d'erreur si le user n'existe pas, pour:
    // L'appel de la fonction dans le middleware express dans index.ts utilisé pour le JWT
    // La création d'une nouveau user, on doit vérifier justement qu'il n'existe pas donc il ne faut pas renvoyer d'erreur si c'est le cas
    async findUserByEmailWitoutAsserting(email: string) {
        return (await this.db.findOne({
            where: { email },
            relations,
        })) as UserEntity
    }

    async create(body: CreateUserInput) {
        const doesUserExists = await this.findUserByEmail(body.email)
        if (doesUserExists) throw new Error('This email is already used')

        const newUser = this.db.create(body)
        await validateData(newUser)
        return await this.db.save(newUser)
    }

    async updateUser({ id, ...body }: UpdateUserInput) {
        const userToUpdate = await this.findUserById(id)

        const userUpdated = this.db.merge(userToUpdate, body)

        await validateData(userUpdated)

        return this.db.save(userUpdated)
    }
}
