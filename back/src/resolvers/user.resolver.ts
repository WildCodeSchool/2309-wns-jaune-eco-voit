import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import {
    CreateUserInput,
    LoginInput,
    UpdateUserInput,
    UpdateUserPasswordInput,
    UserEntity,
    UserMessage,
    UserProfile,
    UserWithoutPassord,
} from '../entities/user.entity'
import { MyContext } from '..'
import Cookies from 'cookies'
import { userAuthorized } from '../utils/userAuthorized'

@Resolver(() => UserEntity)
export default class UserResolver {
    @Authorized(['ADMIN'])
    @Query(() => [UserEntity])
    async listUsers(@Ctx() { userService }: MyContext) {
        return await userService.listUser()
    }

    @Query(() => UserEntity)
    async findUserById(
        @Arg('id') id: string,
        @Ctx() { userService }: MyContext
    ) {
        return await userService.findUserById(id)
    }

    @Authorized()
    @Query(() => UserProfile)
    async getProfile(
        @Ctx()
        {
            user: {
                firstname,
                lastname,
                phoneNumber,
                profilePicture,
                email,
                role,
                dateOfBirth,
                password,
                id,
                averageRate,
            },
        }: MyContext & { user: UserEntity } //l'union de type permet d'indiquer que user ne sera jamais nul ici, grâce au @Authorized
    ): Promise<UserProfile> {
        return {
            firstname,
            lastname,
            phoneNumber,
            profilePicture,
            email,
            role,
            dateOfBirth,
            password,
            id,
            averageRate,
        }
    }

    @Query(() => UserEntity)
    async login(
        @Arg('data') { email, password }: LoginInput,
        @Ctx() { req, res, userService }: MyContext
    ) {
        const result = await userService.login(email, password)
        if (!result) throw new Error('Vérifiez vos informations')

        const { user, token } = result
        const cookies = new Cookies(req, res)
        cookies.set('token', token, { httpOnly: true })
        return user
    }

    @Mutation(() => UserWithoutPassord)
    async register(
        @Arg('data') data: CreateUserInput,
        @Ctx() { userService }: MyContext
    ) {
        return await userService.create(data)
    }

    @Query(() => UserMessage)
    async logout(@Ctx() { req, res, user }: MyContext) {
        if (!user) {
            return new UserMessage(true, 'Aucun utilisateur connecté')
        }
        const cookies = new Cookies(req, res)

        cookies.set('token', '', { httpOnly: true, expires: new Date(0) })
        return new UserMessage(true, 'Vous avez été déconnecté')
    }

    @Authorized()
    @Mutation(() => UserEntity)
    async updateUser(
        @Arg('data') data: UpdateUserInput,
        @Ctx() { user, userService }: MyContext
    ) {
        userAuthorized([data.id], user)

        return await userService.updateUser(data)
    }

    @Authorized()
    @Mutation(() => UserEntity)
    async updateUserPassword(
        @Arg('data') data: UpdateUserPasswordInput,
        @Ctx() { user, userService }: MyContext
    ) {
        const { id } = data

        userAuthorized([id], user)

        return await userService.updateUserPassword(data)
    }

    @Authorized()
    @Mutation(() => UserEntity)
    async archiveUser(
        @Arg('id') id: string,
        @Ctx() { user, userService }: MyContext
    ) {
        userAuthorized([id], user)

        return await userService.updateUser({ id, status: 'ARCHIVED' })
    }
}
