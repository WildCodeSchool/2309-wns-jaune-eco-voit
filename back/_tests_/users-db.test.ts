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

import datasource from '../src/db_test'
import initialDatasource from '../src/db'




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

const baseSchema = buildSchemaSync({
  resolvers: [UserResolver],
});


let server: ApolloServer

beforeAll(async () => {
  server = new ApolloServer({
    schema: baseSchema,
  });

  jest
    .spyOn(initialDatasource, "getRepository")
    .mockReturnValue(datasource.getRepository(UserEntity));

  await datasource.initialize(); //initialisation de la datasource
  // await datasource.getRepository(UserEntity).clear();//vidage de la table et non drop de la base de donnée complète
});
afterAll(async () => {
  await datasource.dropDatabase(); //suppression de la base de donnée
});

describe("Test sur les users avec la base de données", () => {
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
        }
      }
    })
    console.log('===============JSON========', JSON.stringify(response.body))
    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data).toEqual({
      register: { email: 'olivier@yopmail.fr' },
    })
  })
});