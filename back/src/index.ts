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
import db_test from './db_test'
import UserResolver from './resolvers/user.resolver'
import Cookies from 'cookies'
import { jwtVerify } from 'jose'
import { UserEntity } from './entities/user.entity'
import { customAuthChecker } from './lib/authChecker'
import JourneyMessageResolver from './resolvers/journeyMessage.resolver'
import schedule from 'node-schedule'
import { handleJourneysDone } from './utils/scheduler'
import RatingResolver from './resolvers/rating.resolver'
import BookingService from './services/booking.service'
import JourneyService from './services/journey.service'
import SendEmailService from './services/sendEmail.service'
import UserService from './services/user.service'
import RatingService from './services/rating.service'
import JourneyMessageService from './services/journeyMessage.service'

export interface MyContext {
    req: express.Request
    res: express.Response
    user: UserEntity | null
    bookingService: BookingService
    journeyService: JourneyService
    sendEmailService: SendEmailService
    userService: UserService
    ratingsService: RatingService
    journeyMessageService: JourneyMessageService
}

export interface Payload {
    email: string
    role: string
    id: string
}

// Création d'un serveur HTTP à partir de la bibliothéque d'express
const app = express()
const httpServer = http.createServer(app)

const bookingService = new BookingService()
const journeyService = new JourneyService()
const sendEmailService = new SendEmailService()
const userService = new UserService()
const ratingService = new RatingService()
const journeyMessageService = new JourneyMessageService()

async function main() {
    const schema = await buildSchema({
        resolvers: [
            BookingResolver,
            UserResolver,
            JourneyResolver,
            JourneyMessageResolver,
            RatingResolver,
        ],
        validate: true,
        authChecker: customAuthChecker,
    })

    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })

    // Lancement du server
    await server.start()

    // la variable job est necessaire pour créé le cron mais n'est jamais appelée a proprement parlé dans le code
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const job = schedule.scheduleJob('*/20 * * * *', async function () {
        await handleJourneysDone()
    })

    const origins =
        process.env.NODE_ENV === 'test'
            ? ['http://localhost:3003', 'https://studio.apollographql.com']
            : [
                  'http://localhost:3002',
                  'https://studio.apollographql.com',
                  'https://preprod.0923-jaune-1.wns.wilders.dev',
                  'https://0923-jaune-1.wns.wilders.dev',
                  'http://localhost:8000/profile',
                  'http://localhost:8000',
              ]

    app.use(
        '/',
        cors<cors.CorsRequest>({
            origin: origins,
            credentials: true,
        }),
        express.json(),

        // intégre Apollo Server à Express
        expressMiddleware(server, {
            // On passe dans ce callback à chaque requête
            // On retourne un objet contenant res et req à tous les resolvers
            context: async ({ req, res }) => {
                let user: UserEntity | null = null

                const cookies = new Cookies(req, res)
                const token = cookies.get('token')

                if (token) {
                    try {
                        const { payload } = await jwtVerify<Payload>(
                            token,
                            new TextEncoder().encode(process.env.SECRET_KEY)
                        )
                        user =
                            await new UserService().findUserByEmailWitoutAsserting(
                                payload.email
                            )
                    } catch (err) {
                        console.log(err)
                    }
                }

                return {
                    req,
                    res,
                    user,
                    bookingService,
                    journeyService,
                    sendEmailService,
                    userService,
                    ratingService,
                    journeyMessageService,
                }
            },
        })
    )

    const isTestEnv = process.env.NODE_ENV === 'test'
    const port = isTestEnv ? 4003 : 4000

    if (isTestEnv) {
        await db_test.initialize()
    } else {
        await db.initialize()
    }

    await new Promise<void>((resolve) => {
        httpServer.listen({ port }, resolve)
        console.log('Server is running on port', port)
    })
}

main().catch((error) => {
    console.error('Failed to start server:', error)
    process.exit(1)
})
