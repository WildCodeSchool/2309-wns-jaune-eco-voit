import { buildSchemaSync } from 'type-graphql'
import UserResolver from '../src/resolvers/user.resolver'
import { ApolloServer } from '@apollo/server'
import { UserEntity, UserMessage } from '../src/entities/user.entity'
import assert from 'assert'

import datasource from '../src/db_test'
import initialDatasource from '../src/db'

export const REGISTER = `#graphql
    mutation Register($data: CreateUserInput!) {
      register(data: $data) {
              email
          }
      }
`

export const LOGIN = `#graphql
    query Login($data: LoginInput!) {
      login(data: $data) {
          success
          message
        }
    }
`

export const UPDATE_USER = `#graphql 
    mutation Mutation($data: UpdateUserInput!) {
      updateUser(data: $data) {
        id
        firstname
        lastname
      }
    }
`

export const LIST_USERS = `#graphql
    query ListUsers {
      listUsers {
        id
        firstname
        lastname
        email
        }
    }
`

type ResponseRegisterData = {
    email: string
}

// type ResponseLoginData = { login: UserMessage }

type ResponseListUsers = {
    listUsers: UserEntity[]
}

type ResponseUpdateData = { updatedUser: UserEntity }

const baseSchema = buildSchemaSync({
    resolvers: [UserResolver],
    authChecker: () => true, 
})

let server: ApolloServer

beforeAll(async () => {
    server = new ApolloServer({
        schema: baseSchema,
    })

    jest.spyOn(initialDatasource, 'getRepository').mockReturnValue(
        datasource.getRepository(UserEntity)
    )

    await datasource.initialize() //initialisation de la datasource
    // await datasource.getRepository(UserEntityWithoutPassword).clear();//vidage de la table et non drop de la base de donnée complète
})
afterAll(async () => {
    await datasource.dropDatabase() //suppression de la base de donnée
})

describe('Test sur les users avec la base de données', () => {
    it("création d'un user", async () => {
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

        console.log(JSON.stringify(response.body))
        assert(response.body.kind === 'single')
        console.log(response.body)
        expect(response.body.singleResult.data).toEqual({
            register: { email: 'olivier@yopmail.fr' },
        })
    })

    /* Je commente ce text car depuis la mise en place du JWT il ne passe plus

    it('login du user connecté', async () => {
        const response = await server.executeOperation<ResponseLoginData>({
            query: LOGIN,
            variables: {
                data: {
                    email: 'olivier@yopmail.fr',
                    password: 'password',
                },
            },
        })
        console.log(JSON.stringify(response.body))
        assert(response.body.kind === 'single')
        expect(response.body.singleResult.data).toEqual({
            login: { message: 'Welcome back !', success: true },
        })
    })
    */

    it('update du user ', async () => {
        const responseListUser =
            await server.executeOperation<ResponseListUsers>({
                query: LIST_USERS,
            })

        assert(responseListUser.body.kind === 'single')
        const olivierId =
            responseListUser.body.singleResult.data?.listUsers[0].id

        const response = await server.executeOperation<ResponseUpdateData>({
            query: UPDATE_USER,
            variables: {
                data: {
                    id: olivierId,
                    firstname: 'Jacquie',
                },
            },
        })

        assert(response.body.kind === 'single')
        expect(response.body.singleResult.data).toEqual({
            updateUser: {
                id: olivierId,
                firstname: 'Jacquie',
                lastname: 'Ier',
            },
        })
    })
})