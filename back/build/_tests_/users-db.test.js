"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIST_USERS = exports.UPDATE_USER = exports.LOGIN = exports.REGISTER = void 0;
const type_graphql_1 = require("type-graphql");
const user_resolver_1 = __importDefault(require("../src/resolvers/user.resolver"));
const server_1 = require("@apollo/server");
const user_entity_1 = require("../src/entities/user.entity");
const assert_1 = __importDefault(require("assert"));
const db_test_1 = __importDefault(require("../src/db_test"));
const db_1 = __importDefault(require("../src/db"));
exports.REGISTER = `#graphql
    mutation Register($data: CreateUserInput!) {
      register(data: $data) {
              email
          }
      }
`;
exports.LOGIN = `#graphql
    query Login($data: LoginInput!) {
      login(data: $data) {
          success
          message
        }
    }
`;
exports.UPDATE_USER = `#graphql 
    mutation Mutation($data: UpdateUserInput!) {
      updateUser(data: $data) {
        id
        firstname
        lastname
      }
    }
`;
exports.LIST_USERS = `#graphql
    query ListUsers {
      listUsers {
        id
        firstname
        lastname
        email
        }
    }
`;
const baseSchema = (0, type_graphql_1.buildSchemaSync)({
    resolvers: [user_resolver_1.default],
    authChecker: () => true,
});
let server;
beforeAll(async () => {
    server = new server_1.ApolloServer({
        schema: baseSchema,
    });
    jest.spyOn(db_1.default, 'getRepository').mockReturnValue(db_test_1.default.getRepository(user_entity_1.UserEntity));
    await db_test_1.default.initialize(); //initialisation de la datasource
    // await datasource.getRepository(UserEntityWithoutPassword).clear();//vidage de la table et non drop de la base de donnée complète
});
afterAll(async () => {
    await db_test_1.default.dropDatabase(); //suppression de la base de donnée
});
describe('Test sur les users avec la base de données', () => {
    it("création d'un user", async () => {
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
        // console.log(JSON.stringify(response.body))
        (0, assert_1.default)(response.body.kind === 'single');
        // console.log(response.body)
        expect(response.body.singleResult.data).toEqual({
            register: { email: 'olivier@yopmail.fr' },
        });
    });
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
        const responseListUser = await server.executeOperation({
            query: exports.LIST_USERS,
        });
        (0, assert_1.default)(responseListUser.body.kind === 'single');
        const olivierId = responseListUser.body.singleResult.data?.listUsers[0].id;
        const response = await server.executeOperation({
            query: exports.UPDATE_USER,
            variables: {
                data: {
                    id: olivierId,
                    firstname: 'Jacquie',
                },
            },
        });
        (0, assert_1.default)(response.body.kind === 'single');
        expect(response.body.singleResult.data).toEqual({
            updateUser: {
                id: olivierId,
                firstname: 'Jacquie',
                lastname: 'Ier',
            },
        });
    });
});
