import { ApolloServer } from '@apollo/server'
import { buildSchemaSync } from 'type-graphql'
import UserResolver from '../src/resolvers/user.resolver'
import { UserEntity } from '../src/entities/user.entity'
import { addMocksToSchema } from '@graphql-tools/mock'
import assert from 'assert'

type ResponseData = {
    listUsers: UserEntity[]
}

type ResponseOneUser = {
    findUserByIdId: UserEntity
}

let server: ApolloServer

// to delete all Dates from the object (Jest doesn't accept to compare Dates)
const mapData = (ary: Omit<UserEntity, 'hashPassword'>[]) => {
    return ary.map((el) => {
        const { dateOfBirth, createdAt, ...rest } = el
        // I used console.log() to avoid the non used error
        console.log(dateOfBirth, createdAt)
        return rest
    })
}

const baseSchema = buildSchemaSync({
    resolvers: [UserResolver],
    // authChecker: () => true,
})

export const CREATE_USER = `#graphql
mutation Mutation($data: CreateUserInput!) {
  register(data: $data) {
    email
  }
}`

export const LIST_USERS = `#graphql
query ListUsers {
  listUsers {
    id
    firstname
    lastname
    email
    password
    # phoneNumber
    # profilPicture
    role
    grade
    tripsAsPassenger
    tripsAsDriver
    status
    # updatedAt
    # journeys {
      
    # }
    # bookings {
      
    # }
  }
}`

export const FIND_USER_BY_ID = `#graphql
query FindUserById($findUserByIdId: String!) {
    findUserById(id: $findUserByIdId) {
      id
      firstname
      lastname
      email
      password
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
    }
  }
`

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

// On a laissé listUsers dans mocks, et on créé un resolvers pour findUserById puisqu'on a besoin de lui passer un paramètre.
beforeAll(() => {
    const mocks = {
        Query: {
            listUsers() {
                return usersData
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
    // server = new ApolloServer({
    //     schema: baseSchema
    // })
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
    it('premier test', async () => {
        const response = await server.executeOperation<ResponseData>({
            query: LIST_USERS,
        })
        assert(response.body.kind === 'single')
        expect(response.body.singleResult.data).toEqual({
            listUsers: mapData(usersData),
        })
    })
    it('find user by id', async () => {
        const response = await server.executeOperation<ResponseOneUser>({
            query: FIND_USER_BY_ID,
            variables: {
                findUserByIdId: 'abcd',
            },
        })
        assert(response.body.kind === 'single')
        expect(response.body.singleResult.data).toEqual({
            findUserById: mapData(usersData)[0],
        })
    })
})
