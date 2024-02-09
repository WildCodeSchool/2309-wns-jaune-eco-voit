import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import {
    CreateUserInput,
    LoginInput,
    UpdateUserInput,
    UserEntity,
    UserMessage,
    UserWithoutPassord,
} from '../entities/user.entity'
import UsersService from '../services/users.service'

@Resolver(() => UserEntity)
export default class UserResolver {
    @Query(() => [UserEntity])
    async listUsers() {
        return await new UsersService().listUser()
    }

    @Query(() => UserEntity)
    async findUserById(@Arg('id') id: string) {
        const user = await new UsersService().findUserById(id)
        if (!user) throw new Error('No data found')
        return user
    }

    @Query(() => UserEntity)
    async findUserByEmail(@Arg('email') email: string) {
        const user = await new UsersService().findUserById(email)
        if (!user) throw new Error('No data found')
        return user
    }

    @Query(() => UserMessage)
    async login(@Arg('data') data: LoginInput) {
        const userService = new UsersService()
        const user = await userService.findUserByEmail(data.email)

        const errorMessage = new UserMessage()
        errorMessage.success = false
        errorMessage.message = 'Vérifier vos informations'

        const successMessage = new UserMessage()
        successMessage.success = true
        successMessage.message = 'Bienvenue !'

        if (!user) {
            return errorMessage
        }

        const isPasswordOk = data.password === user.password

        return isPasswordOk ? successMessage : errorMessage
    }

    @Mutation(() => UserWithoutPassord || UserMessage)
    async register(@Arg('data') data: CreateUserInput) {
        const usersService = new UsersService()

        const userExist = await usersService.findUserByEmail(data.email)

        if (userExist) {
            const message = new UserMessage()
            message.success = false
            message.message = "L'utilisateur existe déjà"
            return message
        }

        return await usersService.createUser(data)
    }

    @Mutation(() => UserEntity)
    async updateUser(@Arg('data') data: UpdateUserInput) {
        return await new UsersService().updateUser(data)
    }

    @Mutation(() => UserEntity)
    async archiveUser(@Arg('id') id: string) {
        return new UsersService().updateUser({ id, status: 'ARCHIVED' })
    }

    @Mutation(() => UserEntity)
    async increaseTripsAsPassenger(@Arg('id') id: string) {
        const usersService = new UsersService()
        const user = await usersService.findUserById(id)
        if (!user) return new Error('Utilisateur inconnu')

        return new UsersService().updateUser({
            id,
            tripsAsPassenger: user.tripsAsPassenger++,
        })
    }

    @Mutation(() => UserEntity)
    async increaseTripsAsDriver(@Arg('id') id: string) {
        const usersService = new UsersService()
        const user = await usersService.findUserById(id)
        if (!user) return new Error('Utilisateur inconnu')
        return usersService.updateUser({
            id,
            tripsAsDriver: user.tripsAsDriver++,
        })
    }
}
