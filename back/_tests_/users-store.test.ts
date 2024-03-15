import { buildSchemaSync } from 'type-graphql'
import UserResolver from '../src/resolvers/user.resolver'
import { ApolloServer } from '@apollo/server'
import { printSchema } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import {
    IMockStore,
    addMocksToSchema,
    createMockStore,
} from '@graphql-tools/mock'
import { CreateUserInput, UserEntity } from '../src/entities/user.entity'
import assert from 'assert'

let server: ApolloServer

const baseSchema = buildSchemaSync({
    resolvers: [UserResolver],
    authChecker: () => true,
})

// Transforme le schéma en chaine de caractère
const schemaString = printSchema(baseSchema)
// Transforme la chain de caractère en un schéma exécutable
const schema = makeExecutableSchema({ typeDefs: schemaString })

const usersData: Omit<UserEntity, 'hashPassword'>[] = [
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
]

export const REGISTER = `#graphql
    mutation Register($data: CreateUserInput!) {
    register(data: $data) {
            email
        }
    }
`

type ResponseRegisterData = {
    email: string
}

beforeAll(async () => {
    // createMockStore est une fonction utilisée pour créer un store de fausses données/
    // On lui passe en param un schema exécutable créé plus haut
    const store = createMockStore({ schema })

    const resolvers = (store: IMockStore) => ({
        Mutation: {
            register(_: null, { data }: { data: CreateUserInput }) {
                const id = JSON.stringify(new Date())
                const dataToCreateUser = {
                    role: 'USER',
                    grade: 'BEGINNER',
                    tripsAsPassenger: 0,
                    tripsAsDriver: 0,
                    createdAt: new Date(),
                    status: 'ACTIVE',
                    ...data,
                }
                store.set('UserEntity', id, dataToCreateUser)
                return store.get('UserEntity', id)
            },
        },
    })

    server = new ApolloServer({
        schema: addMocksToSchema({
            schema: baseSchema,
            store,
            resolvers,
        }),
    })

    // Pour set plusieurs données d'un coup dans le store,
    // On set la Query listUsers, comme étant usersData
    store.set('Query', 'ROOT', 'listUsers', usersData)
})

describe('Tests store sur les users', () => {
    it('Register a user', async () => {
        const response = await server.executeOperation<ResponseRegisterData>({
            query: REGISTER,
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
        })
        assert(response.body.kind === 'single')
        expect(response.body.singleResult.data).toEqual({
            register: { email: 'olivier@yopmail.fr' },
        })
    })
})
