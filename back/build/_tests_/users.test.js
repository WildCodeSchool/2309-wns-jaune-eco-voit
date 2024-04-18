"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIND_USER_BY_ID = exports.LIST_USERS = exports.CREATE_USER = void 0;
const server_1 = require("@apollo/server");
const type_graphql_1 = require("type-graphql");
const user_resolver_1 = __importDefault(require("../src/resolvers/user.resolver"));
const mock_1 = require("@graphql-tools/mock");
const assert_1 = __importDefault(require("assert"));
let server;
// to delete all Dates from the object (Jest doesn't accept to compare Dates)
const mapData = (dataArray) => {
    return dataArray.map((el) => {
        const { dateOfBirth, createdAt, ...rest } = el;
        // log to avoid non used error
        console.log(dateOfBirth, createdAt);
        return rest;
    });
};
const baseSchema = (0, type_graphql_1.buildSchemaSync)({
    resolvers: [user_resolver_1.default],
    authChecker: () => true,
});
exports.CREATE_USER = `#graphql
mutation Mutation($data: CreateUserInput!) {
  register(data: $data) {
    email
  }
}`;
exports.LIST_USERS = `#graphql
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
}`;
exports.FIND_USER_BY_ID = `#graphql
query FindUserById($findUserById: String!) {
    findUserById(id: $findUserById) {
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
`;
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
// On a laissé listUsers dans mocks, et on créé un resolvers pour findUserById puisqu'on a besoin de lui passer un paramètre.
beforeAll(async () => {
    const mocks = {
        Query: {
            listUsers() {
                return usersData;
            },
        },
    };
    const resolvers = () => ({
        Query: {
            findUserById(_, args) {
                return usersData.find((user) => user.id === args.id);
            },
        },
    });
    // server = new ApolloServer({
    //     schema: baseSchema
    // })
    server = new server_1.ApolloServer({
        schema: (0, mock_1.addMocksToSchema)({
            schema: baseSchema,
            mocks,
            resolvers: resolvers,
        }),
    });
});
describe('Test sur les Users', () => {
    it('premier test', async () => {
        const response = await server.executeOperation({
            query: exports.LIST_USERS,
        });
        (0, assert_1.default)(response.body.kind === 'single');
        expect(response.body.singleResult.data).toEqual({
            listUsers: mapData(usersData),
        });
    });
    it('find user by id', async () => {
        const response = await server.executeOperation({
            query: exports.FIND_USER_BY_ID,
            variables: {
                findUserById: 'abcd',
            },
        });
        (0, assert_1.default)(response.body.kind === 'single');
        expect(response.body.singleResult.data).toEqual({
            findUserById: mapData(usersData)[0],
        });
    });
});
