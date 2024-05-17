import { ApolloServer } from '@apollo/server'
import { Query, buildSchemaSync } from 'type-graphql'
import UserResolver from '../src/resolvers/user.resolver'
import { UserEntity } from '../src/entities/user.entity'
import { addMocksToSchema } from '@graphql-tools/mock'
import assert from 'assert'

import { JourneyEntity } from '../src/entities/journey.entity'
import { usersData } from './utils/mocks/users.mocks'
import { journeysData } from './utils/mocks/journeys.mocks'
import {
    ResponseFindUserById,
    ResponseListUsers,
} from './utils/types/users.type'
import {
    FIND_USER_BY_ID,
    LIST_USERS,
} from './utils/requetes/queries/user.queries'
import { ResponseListJourneys } from './utils/types/journeys.type'
import { LIST_JOURNEYS } from './utils/requetes/queries/journeys.queries'

let server: ApolloServer

// to delete all Dates from the object (Jest doesn't accept to compare Dates)
const mapUserData = (dataArray: Omit<UserEntity, 'hashPassword'>[]) => {
    return dataArray.map((el) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dateOfBirth, createdAt, ...rest } = el
        return rest
    })
}

const mapJourneyData = (dataArray: Omit<JourneyEntity, 'user'>[]) => {
    return dataArray.map((el) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { arrival_time, departure_time, createdAt, ...rest } = el
        return rest
    })
}

const baseSchema = buildSchemaSync({
    resolvers: [UserResolver],
    authChecker: () => true,
})

// On a laissé listUsers dans mocks, et on créé un resolvers pour findUserById puisqu'on a besoin de lui passer un paramètre.
beforeAll(async () => {
    const mocks = {
        Query: {
            listUsers() {
                return usersData
            },
        },
        Query: {
            listJourneys() {
                return journeysData
            },
        },
    }

    const resolvers = () => ({
        Query: {
            findUserById(_: null, args: { id: string }) {
                return usersData.find((user) => user.id === args.id)
            },
        },
    })

    server = new ApolloServer({
        schema: addMocksToSchema({
            schema: baseSchema,
            mocks,
            resolvers: resolvers as unknown as ReturnType<typeof resolvers> &
                typeof mocks,
        }),
    })
})

describe('Test sur les Users', () => {
    // it('should return users list', async () => {
    //     const response = await server.executeOperation<ResponseListUsers>({
    //         query: LIST_USERS,
    //     })
    //     assert(response.body.kind === 'single')
    //     expect(response.body.singleResult.data).toEqual({
    //         listUsers: mapUserData(usersData),
    //     })
    // })

    it('should find a user by its id', async () => {
        const response = await server.executeOperation<ResponseFindUserById>({
            query: FIND_USER_BY_ID,
            variables: {
                findUserById: 'abcd',
            },
        })
        assert(response.body.kind === 'single')
        expect(response.body.singleResult.data).toEqual({
            findUserById: mapUserData(usersData).find(
                ({ id }) => id === 'abcd'
            ),
        })
    })

    it('should return journeys list', async () => {
        const response = await server.executeOperation<ResponseListJourneys>({
            query: LIST_JOURNEYS,
        })
        assert(response.body.kind === 'single')
        console.log(JSON.stringify(response.body.singleResult))
        expect(response.body.singleResult.data).toEqual({
            listJourneys: mapJourneyData(journeysData),
        })
    })
})
