import express from 'express'
import { buildSchema } from 'type-graphql'
import http from 'http'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'

import BookingResolver from './resolvers/booking.resolver'
// import JourneyResolver from './resolvers/journey.resolver'
import { ApolloServer } from '@apollo/server'
import db from './db'
import UserResolver from './resolvers/user.resolver'

const app = express()
const httpServer = http.createServer(app) // on créer un server HTTP à partir de la bibliothéque d'express, pour avoir Req et Res (pour les middlwares)

async function main() {
    const schema = await buildSchema({
        resolvers: [BookingResolver, UserResolver],
        validate: false,
    })
    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // Informe Apollo Server, qu'il utilisera le server Http créer plus haut
    })
    // lancement du server
    await server.start()
    app.use(
        '/',
        cors<cors.CorsRequest>({ origin: '*' }), // autorise toutes les origines à accéder à l'API. En spécifiant { origin: "*" }, cela permet à n'importe quel domaine d'accéder à l'API
        express.json(),
        expressMiddleware(server, {}) // intégre Apollo Server à Express
    )
    await db.initialize()

    await new Promise<void>((resolve) => {
        httpServer.listen({ port: 4000 }, resolve)
        console.log('Server is running on port', 4000)
    })
}
main()
