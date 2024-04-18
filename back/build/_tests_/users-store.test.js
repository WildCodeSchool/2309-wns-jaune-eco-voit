"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTER = void 0;
const type_graphql_1 = require("type-graphql");
const user_resolver_1 = __importDefault(require("../src/resolvers/user.resolver"));
const server_1 = require("@apollo/server");
const graphql_1 = require("graphql");
const schema_1 = require("@graphql-tools/schema");
const mock_1 = require("@graphql-tools/mock");
const assert_1 = __importDefault(require("assert"));
let server;
const baseSchema = (0, type_graphql_1.buildSchemaSync)({
    resolvers: [user_resolver_1.default],
    authChecker: () => true,
});
// Transforme le schéma en chaine de caractère
const schemaString = (0, graphql_1.printSchema)(baseSchema);
// Transforme la chain de caractère en un schéma exécutable
const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: schemaString });
const usersData = [
    {
        id: 'abcd',
        email: 'user1@yopmail.fr',
        firstname: 'Marie',
        lastname: 'Lou',
        dateOfBirth: new Date('2024-02-08T08:32:23.698Z'),
        password: 'password',
        role: 'USER',
        grade: 'BEGINNER',
        tripsAsDriver: 0,
        tripsAsPassenger: 0,
        createdAt: new Date('2024-02-08T08:33:55.194Z'),
        status: 'ACTIVE',
    },
    {
        id: 'efgh',
        email: 'user2@yopmail.fr',
        firstname: 'Alex',
        lastname: 'Andre',
        dateOfBirth: new Date('2012-12-31T23:00:00.000Z'),
        password: 'password',
        role: 'USER',
        grade: 'BEGINNER',
        tripsAsDriver: 0,
        tripsAsPassenger: 0,
        createdAt: new Date('2024-02-08T08:33:55.194Z'),
        status: 'ACTIVE',
    },
];
exports.REGISTER = `#graphql
    mutation Register($data: CreateUserInput!) {
    register(data: $data) {
            email
        }
    }
`;
beforeAll(async () => {
    // createMockStore est une fonction utilisée pour créer un store de fausses données/
    // On lui passe en param un schema exécutable créé plus haut
    const store = (0, mock_1.createMockStore)({ schema });
    const resolvers = (store) => ({
        Mutation: {
            register(_, { data }) {
                const id = JSON.stringify(new Date());
                const dataToCreateUser = {
                    role: 'USER',
                    grade: 'BEGINNER',
                    tripsAsPassenger: 0,
                    tripsAsDriver: 0,
                    createdAt: new Date(),
                    status: 'ACTIVE',
                    ...data,
                };
                store.set('UserEntity', id, dataToCreateUser);
                return store.get('UserEntity', id);
            },
        },
    });
    server = new server_1.ApolloServer({
        schema: (0, mock_1.addMocksToSchema)({
            schema: baseSchema,
            store,
            resolvers,
        }),
    });
    // Pour set plusieurs données d'un coup dans le store,
    // On set la Query listUsers, comme étant usersData
    store.set('Query', 'ROOT', 'listUsers', usersData);
});
describe('Tests store sur les users', () => {
    it('Register a user', async () => {
        const response = await server.executeOperation({
            query: exports.REGISTER,
            variables: {
                data: {
                    email: 'olivier@yopmail.fr',
                    firstname: 'Oliv',
                    lastname: 'Ier',
                    dateOfBirth: new Date('2024-02-08T08:32:23.698Z'),
                    password: 'password',
                    role: 'USER',
                },
            },
        });
        (0, assert_1.default)(response.body.kind === 'single');
        expect(response.body.singleResult.data).toEqual({
            register: { email: 'olivier@yopmail.fr' },
        });
    });
});
