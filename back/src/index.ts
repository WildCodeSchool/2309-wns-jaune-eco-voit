import express from 'express'
import { buildSchema } from 'type-graphql'
import http from 'http'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'

import BookingResolver from './resolvers/booking.resolver'
import JourneyResolver from './resolvers/journey.resolver'
import { ApolloServer } from '@apollo/server'
import db from './db'
import UserResolver from './resolvers/user.resolver'
import Cookies from 'cookies'
import { jwtVerify, errors } from 'jose'
import { UserEntity } from './entities/user.entity'
import UsersService from './services/users.service'
import { customAuthChecker } from './lib/authChecker'

export interface MyContext {
    req: express.Request
    res: express.Response
    user: UserEntity | null
}

export interface Payload {
    email: string
}

const app = express()
const httpServer = http.createServer(app) // on créer un server HTTP à partir de la bibliothéque d'express, pour avoir Req et Res (pour les middlwares)

async function main() {
    const schema = await buildSchema({
        resolvers: [BookingResolver, UserResolver, JourneyResolver],
        validate: true,
        authChecker: customAuthChecker,
    })
    const server = new ApolloServer<MyContext>({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // Informe Apollo Server, qu'il utilisera le server Http créer plus haut
    })
    // lancement du server
    await server.start()
    app.use(
        '/',
        // autorise toutes les origines à accéder à l'API. En spécifiant { origin: "*" }, cela permet à n'importe quel domaine d'accéder à l'API
        cors<cors.CorsRequest>({
            origin: [
                'http://localhost:3002',
                'https://studio.apollographql.com',
            ],
            credentials: true,
        }),
        express.json(),
        // intégre Apollo Server à Express
        expressMiddleware(server, {
            // On passe dans ce callback à chaque requette
            // On retourne un objet un objet contenant res et req à tous les resolvers
            context: async ({ req, res }) => {
                let user: UserEntity | null = null

                const cookies = new Cookies(req, res)
                const token = cookies.get('token')

                if (token) {
                    try {
                        const verify = await jwtVerify<Payload>(
                            token,
                            new TextEncoder().encode(process.env.SECRET_KEY)
                        )
                        user =
                            await new UsersService().findUserByEmailWitoutAsserting(
                                verify.payload.email
                            )
                    } catch (err) {
                        console.log(err)
                    }
                }
                return { req, res, user }
            },
        })
    )
    await db.initialize()

    await new Promise<void>((resolve) => {
        httpServer.listen({ port: 4000 }, resolve)
        console.log('Server is running on port', 4000)
    })
}
main()
