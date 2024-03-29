import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
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
import { userAuthorized } from '../utils/userAuthorized'

@Resolver(() => UserEntity)
export default class UserResolver {
    @Authorized(['ADMIN'])
    @Query(() => [UserEntity])
    async listUsers() {
        return await new UsersService().listUser()
    }

    @Query(() => UserEntity)
    async findUserById(@Arg('id') id: string) {
        return await new UsersService().findUserById(id)
    }

    // @Authorized()
    // @Query(() => UserEntity)
    // async findUserByEmail(@Arg('email') email: string) {
    //     return await new UsersService().findUserById(email)
    // }

    @Query(() => UserEntity)
    async login(
        @Arg('data') { email, password }: LoginInput,
        @Ctx() { req, res }: MyContext
    ) {
        const userService = new UsersService()

        const user = await userService.findUserByEmailWitoutAsserting(email)

        if (!user) throw new Error('Vérifiez vos informations')

        const isPasswordValid = await argon2.verify(user.password, password)

        if (isPasswordValid) {
            const token = await new SignJWT({
                email,
                role: user.role,
                id: user.id,
            })
                // alg = algorithme à utiliser pour hasher la signature
                // typ = le type de token qui est généré
                .setProtectedHeader({
                    alg: 'HS256',
                    typ: 'jwt',
                })
                // Durée de validité du token
                .setExpirationTime('2 h')
                // La méthode encode() de la classe TextEncoder permet d'obtenir un flux d'octets encodés en utf-8 à partir d'une chaine de caractère
                // car sign() attend en premier argument un Uint8Array et non une string, d'ou l'utilisation de TextEncoder
                .sign(new TextEncoder().encode(`${process.env.SECRET_KEY}`))

            // On crée une instance de la classe Cookies en lui passant la req et la res du context crée dans l'expressMiddleware (index.ts)
            const cookies = new Cookies(req, res)
            // On set un nouveau cookie nommé 'token' contenant le token créé
            // httpOnly s'assure que le cookie n'est pas modifiable depuis le client (readonly)
            // Evite les attaques cross site scripting (XSS)
            cookies.set('token', token, { httpOnly: true })

            return user
        }

        throw new Error('Vérifiez vos informations')
    }

    @Mutation(() => UserWithoutPassord)
    async register(@Arg('data') data: CreateUserInput) {
        return await new UsersService().create(data)
    }

    @Query(() => UserMessage)
    async logout(@Ctx() { req, res, user }: MyContext) {
        if (user) {
            const cookies = new Cookies(req, res)

            cookies.set('token') // sans valeur, le cookie token sera supprimé
        }
        return new UserMessage(true, 'Vous avez été déconnecté')
    }

    @Authorized()
    @Mutation(() => UserEntity)
    async updateUser(
        @Arg('data') data: UpdateUserInput,
        @Ctx() { user }: MyContext
    ) {
        userAuthorized([data.id], user)

        return await new UsersService().updateUser(data)
    }

    @Authorized()
    @Mutation(() => UserEntity)
    async archiveUser(@Arg('id') id: string, @Ctx() { user }: MyContext) {
        userAuthorized([id], user)

        return await new UsersService().updateUser({ id, status: 'ARCHIVED' })
    }
}
