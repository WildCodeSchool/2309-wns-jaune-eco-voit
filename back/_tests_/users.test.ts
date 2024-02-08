import { ApolloServer } from "@apollo/server"
import { buildSchemaSync } from "type-graphql";
import UserResolver from "../src/resolvers/user.resolver";
import { UserEntity } from "../src/entities/user.entity";
import { addMocksToSchema } from "@graphql-tools/mock";
import assert from "assert";

let server: ApolloServer;

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
    dateOfBirth
    # phoneNumber
    # profilPicture
    role
    grade
    tripsAsPassenger
    tripsAsDriver
    status
    createdAt
    # updatedAt
    # journeys {
      
    # }
    # bookings {
      
    # }
  }
}`

type ResponseData = {
    users: UserEntity[]
}

const usersData: UserEntity[] = [
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



beforeAll(() => {
    const mocks = {
        Query: {
            listUsers(){
                return usersData
            }
        }
    }
    // server = new ApolloServer({
    //     schema: baseSchema
    // })
    server = new ApolloServer({
        schema: addMocksToSchema({ schema: baseSchema, mocks})
    })
})

describe('Test sur les Users' , () => {
    it("premier test", async () => {
        const response = await server.executeOperation<ResponseData>({
            query: LIST_USERS
        })
        console.log("RESPONSE LIST USER", JSON.stringify(response))
        assert(response.body.kind === 'single');
        expect(response.body.singleResult.data).toEqual({
            users: usersData,
        })
    })
})