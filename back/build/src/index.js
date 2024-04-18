"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const http_1 = __importDefault(require("http"));
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const booking_resolver_1 = __importDefault(require("./resolvers/booking.resolver"));
const journey_resolver_1 = __importDefault(require("./resolvers/journey.resolver"));
const server_1 = require("@apollo/server");
const db_1 = __importDefault(require("./db"));
const user_resolver_1 = __importDefault(require("./resolvers/user.resolver"));
const cookies_1 = __importDefault(require("cookies"));
const jose_1 = require("jose");
const users_service_1 = __importDefault(require("./services/users.service"));
const authChecker_1 = require("./lib/authChecker");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app); // on créer un server HTTP à partir de la bibliothéque d'express, pour avoir Req et Res (pour les middlwares)
async function main() {
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [booking_resolver_1.default, user_resolver_1.default, journey_resolver_1.default],
        validate: true,
        authChecker: authChecker_1.customAuthChecker,
    });
    const server = new server_1.ApolloServer({
        schema,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })], // Informe Apollo Server, qu'il utilisera le server Http créer plus haut
    });
    // lancement du server
    await server.start();
    app.use('/', 
    // autorise toutes les origines à accéder à l'API. En spécifiant { origin: "*" }, cela permet à n'importe quel domaine d'accéder à l'API
    (0, cors_1.default)({
        origin: [
            'http://localhost:3002',
            'https://studio.apollographql.com',
        ],
        credentials: true,
    }), express_1.default.json(), 
    // intégre Apollo Server à Express
    (0, express4_1.expressMiddleware)(server, {
        // On passe dans ce callback à chaque requette
        // On retourne un objet un objet contenant res et req à tous les resolvers
        context: async ({ req, res }) => {
            let user = null;
            const cookies = new cookies_1.default(req, res);
            const token = cookies.get('token');
            if (token) {
                try {
                    const verify = await (0, jose_1.jwtVerify)(token, new TextEncoder().encode(process.env.SECRET_KEY));
                    user =
                        await new users_service_1.default().findUserByEmailWitoutAsserting(verify.payload.email);
                }
                catch (err) {
                    console.log(err);
                }
            }
            return { req, res, user };
        },
    }));
    await db_1.default.initialize();
    await new Promise((resolve) => {
        httpServer.listen({ port: 4000 }, resolve);
        console.log('Server is running on port', 4000);
    });
}
main();
