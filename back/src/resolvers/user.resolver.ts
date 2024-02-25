import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import {
    CreateUserInput,
    LoginInput,
    UpdateUserInput,
    UserEntity,
    UserMessage,
    UserWithoutPassord,
} from '../entities/user.entity'
import UsersService from '../services/users.service'
import argon2 from 'argon2'
import { SignJWT } from 'jose'
import { MyContext } from '..'
import Cookies from 'cookies'

@Resolver(() => UserEntity)
export default class UserResolver {
    @Query(() => [UserEntity])
    async listUsers() {
        return await new UsersService().listUser()
    }

    @Query(() => UserEntity)
    async findUserById(@Arg('id') id: string) {
        return await new UsersService().findUserById(id)
    }

    @Query(() => UserEntity)
    async findUserByEmail(@Arg('email') email: string) {
        return await new UsersService().findUserById(email)
    }

    @Query(() => UserMessage)
    async login(
        @Arg('data') { email, password }: LoginInput,
        @Ctx() { req, res }: MyContext
    ) {
        const userService = new UsersService()

        const user = await userService.findUserByEmail(email)

        const errorMessage = new UserMessage(false, 'Check your informations')

        if (!user) return errorMessage

        const isPasswordValid = await argon2.verify(user.password, password)

<<<<<<< HEAD
        if (isPasswordValid) {
            const token = await new SignJWT({ email })
                // alg = algorithme à utiliser pour hasher la signature
                // typ = le type de token qui est généré
                .setProtectedHeader({
                    alg: 'HS256',
                    typ: 'jwt',
                })
                // Durée de validité du token
                .setExpirationTime('2h')
                // La méthode encode() de la classe TextEncoder permet d'obtenir un flux d'octets encodés en utf-8 à partir d'une chaine de caractère
                // car sign() attend en premier argument un Uint8Array et non une string, d'ou l'utilisation de TextEncoder
                .sign(new TextEncoder().encode(`${process.env.SECRET_KEY}`))
            console.log(token)
=======
        const successMessage = new UserMessage(true, 'Welcome back !')
>>>>>>> 4d01abfe (Correction test)

            // On crée une instance de la classe Cookies en lui passant la req et la res du context crée dans l'expressMiddleware (index.ts)
            const cookies = new Cookies(req, res)
            // On set un nouveau cookie nommé 'token' contenant le token créé
            // httpOnly s'assure que le cookie n'est pas modifiable depuis le client (readonly)
            // Evite les attaques cross site scripting (XSS)
            cookies.set('token', token, { httpOnly: true })

            const successMessage = new UserMessage()
            successMessage.success = true
            successMessage.message = 'Bienvenue !'
            return successMessage
        }

        return errorMessage
    }

    @Mutation(() => UserWithoutPassord || UserMessage)
    async register(@Arg('data') data: CreateUserInput) {
        const usersService = new UsersService()

        const userExist = await usersService.findUserByEmail(data.email)

        if (userExist) {
            return new UserMessage(false, 'This user already exists')
        }

        return await usersService.create(data)
    }

    @Mutation(() => UserEntity)
    async updateUser(@Arg('data') data: UpdateUserInput) {
        return await new UsersService().updateUser(data)
    }

    @Mutation(() => UserEntity)
    async archiveUser(@Arg('id') id: string) {
        return await new UsersService().updateUser({ id, status: 'ARCHIVED' })
    }

    @Mutation(() => UserEntity)
    async increaseTripsAsPassenger(@Arg('id') id: string) {
        const usersService = new UsersService()

        const { tripsAsPassenger } = await usersService.findUserById(id)
        return new UsersService().updateUser({
            id,
            tripsAsPassenger: tripsAsPassenger + 1,
        })
    }

    @Mutation(() => UserEntity)
    async increaseTripsAsDriver(@Arg('id') id: string) {
        const usersService = new UsersService()

        const { tripsAsDriver } = await usersService.findUserById(id)
        return usersService.updateUser({
            id,
            tripsAsDriver: tripsAsDriver + 1,
        })
    }
}
