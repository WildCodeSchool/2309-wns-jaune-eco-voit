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
        const user = await new UsersService().findUserById(id)
        if (!user) throw new Error('No data found')
        return user
    }

    @Query(() => UserEntity)
    async findUserByEmail(@Arg('email') email: string) {
        const user = await new UsersService().findUserByEmail(email)
        if (!user) throw new Error('No data found')
        return user
    }

    @Query(() => UserMessage)
    async login(
        @Arg('data') { email, password }: LoginInput,
        @Ctx() { req, res }: MyContext
    ) {
        const userService = new UsersService()

        const user = await userService.findUserByEmail(email)

        const errorMessage = new UserMessage()
        errorMessage.success = false
        errorMessage.message = 'Vérifier vos informations'

        if (!user) return errorMessage

        const isPasswordValid = await argon2.verify(user.password, password)

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
            const message = new UserMessage()
            message.success = false
            message.message = "L'utilisateur existe déjà"
            return message
        }

        return await usersService.create(data)
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
