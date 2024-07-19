import { buildSchemaSync } from 'type-graphql'
import UserResolver from '../src/resolvers/user.resolver'
import JourneyResolver from '../src/resolvers/journey.resolver'
import BookingResolver from '../src/resolvers/booking.resolver'
import { ApolloServer } from '@apollo/server'
import assert from 'assert'

import datasource from '../src/db_test_jest'
import initialDatasource from '../src/db'
import UserService from '../src/services/user.service'
import JourneyService from '../src/services/journey.service'
import BookingService from '../src/services/booking.service'
import { CreateUserInput, UserEntity } from '../src/entities/user.entity'
import { JourneyEntity } from '../src/entities/journey.entity'
import { BookingEntity } from '../src/entities/booking.entity'
import {
    REGISTER,
    UPDATE_USER,
} from './utils/requetes/mutations/user.mutations'
import { ResponseRegisterData } from './utils/types/users.type'
import { EntityTarget, Repository } from 'typeorm'
import { CREATE_JOURNEY } from './utils/requetes/mutations/journeys.mutations'
import {
    ResponseCreateJourney,
    ResponseFindJourneyById,
    ResponseListJourneys,
} from './utils/types/journeys.type'
import {
    FIND_JOURNEY_BY_ID,
    LIST_JOURNEYS,
} from './utils/requetes/queries/journeys.queries'
import { CREATE_BOOKING } from './utils/requetes/mutations/bookings.mutations'
import {
    ResponseCreateBooking,
    ResponseListBookings,
} from './utils/types/bookings.type'
import { customAuthChecker } from '../src/lib/authChecker'
import { LIST_BOOKINGS } from './utils/requetes/queries/bookings.query'

const baseSchema = buildSchemaSync({
    resolvers: [UserResolver, JourneyResolver, BookingResolver],
    authChecker: customAuthChecker,
})

let server: ApolloServer
let marielouPassenger: ResponseRegisterData['register'] | undefined
let olivierDriver: ResponseRegisterData['register'] | undefined
let asmaUser: ResponseRegisterData['register'] | undefined

beforeAll(async () => {
    server = new ApolloServer({
        schema: baseSchema,
    })

    jest.spyOn(initialDatasource, 'getRepository').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entity: EntityTarget<any>): Repository<any> => {
            if (entity === UserEntity) {
                return datasource.getRepository(UserEntity)
            } else if (entity === JourneyEntity) {
                return datasource.getRepository(JourneyEntity)
            } else if (entity === BookingEntity) {
                return datasource.getRepository(BookingEntity)
            } else {
                throw new Error(`Unexpected entity: ${entity}`)
            }
        }
    )

    await datasource.initialize()

    const createUser = async (data: CreateUserInput) => {
        return server.executeOperation<ResponseRegisterData>(
            {
                query: REGISTER,
                variables: {
                    data,
                },
            },
            {
                contextValue: {
                    userService: new UserService(),
                },
            }
        )
    }

    const driverResponse = await createUser({
        email: 'olivier@yopmail.fr',
        firstname: 'Oliv',
        lastname: 'Ier',
        dateOfBirth: new Date('1985-02-08T00:00:00.698Z'),
        password: 'password',
        role: 'USER',
    })
    assert(driverResponse.body.kind === 'single')
    olivierDriver = driverResponse.body.singleResult.data?.register

    const passengerResponse = await createUser({
        email: 'marielou@yopmail.fr',
        firstname: 'Marie',
        lastname: 'Lou',
        dateOfBirth: new Date('1992-05-07T00:00:00.698Z'),
        password: 'password',
        role: 'USER',
    })
    assert(passengerResponse.body.kind === 'single')

    marielouPassenger = passengerResponse.body.singleResult.data?.register

    const userReponse = await createUser({
        email: 'asma@yopmail.fr',
        firstname: 'Asma',
        lastname: 'Kikou',
        dateOfBirth: new Date('1992-05-07T00:00:00.698Z'),
        password: 'password',
        role: 'USER',
    })
    assert(userReponse.body.kind === 'single')
    asmaUser = userReponse.body.singleResult.data?.register
})

afterAll(async () => {
    await datasource.dropDatabase()
})

describe('Test sur une base de donnée de test', () => {
    it('should not allow a user to create two accounts with same email', async () => {
        const response = await server.executeOperation<ResponseRegisterData>(
            {
                query: REGISTER,
                variables: {
                    data: {
                        email: 'marielou@yopmail.fr',
                        firstname: 'Marie',
                        lastname: 'Lou',
                        dateOfBirth: new Date('1992-05-07T00:00:00.698Z'),
                        password: 'password',
                        role: 'USER',
                    },
                },
            },
            {
                contextValue: {
                    userService: new UserService(),
                },
            }
        )

        assert(response.body.kind === 'single')
        const { errors } = response.body.singleResult
        expect(errors).toBeDefined()
        expect(errors?.[0].message).toBe('Cet email est déjà utilisé')
    })

    it('should prevent a non-admin user from accessing the list of all bookings', async () => {
        const responseListBookings =
            await server.executeOperation<ResponseListBookings>(
                {
                    query: LIST_BOOKINGS,
                },
                {
                    contextValue: {
                        BookingService: new BookingService(),
                        user: marielouPassenger,
                    },
                }
            )
        assert(responseListBookings.body.kind === 'single')
        const { errors } = responseListBookings.body.singleResult
        expect(errors).toBeDefined()
        expect(errors?.[0].message).toBe(
            "Access denied! You don't have permission for this action!"
        )
    })

    it('should prevent a non-admin user from accessing the list of all bookings', async () => {
        const response = await server.executeOperation<ResponseRegisterData>(
            {
                query: UPDATE_USER,
                variables: {
                    data: {
                        id: marielouPassenger?.id,
                        lastname: 'Loulou',
                    },
                },
            },
            {
                contextValue: {
                    userService: new UserService(),
                    user: marielouPassenger,
                },
            }
        )
        assert(response.body.kind === 'single')
        expect(response.body.singleResult.data).toEqual({
            updateUser: {
                id: marielouPassenger?.id,
                firstname: marielouPassenger?.firstname,
                lastname: 'Loulou',
            },
        })
    })

    it("should prevent a user from updating another user's profile", async () => {
        const response = await server.executeOperation<ResponseRegisterData>(
            {
                query: UPDATE_USER,
                variables: {
                    data: {
                        id: marielouPassenger?.id,
                        lastname: 'Loulou',
                    },
                },
            },
            {
                contextValue: {
                    userService: new UserService(),
                    user: olivierDriver,
                },
            }
        )

        assert(response.body.kind === 'single')
        const { errors } = response.body.singleResult
        expect(errors).toBeDefined()
        expect(errors?.[0].message).toBe('Accès non autorisé')
    })

    it('should allow a user to create a journey as a driver', async () => {
        const responseCreateJourney =
            await server.executeOperation<ResponseCreateJourney>(
                {
                    query: CREATE_JOURNEY,
                    variables: {
                        data: {
                            arrival_time: '2011-10-05T14:48:00.000Z',
                            automaticAccept: true,
                            availableSeats: 3,
                            departure_time: '2011-10-05T14:48:00.000Z',
                            destination: 'Paris',
                            origin: 'Nantes',
                            price: 35,
                            user: {
                                id: olivierDriver?.id,
                            },
                        },
                    },
                },
                {
                    contextValue: {
                        journeyService: new JourneyService(),
                        user: olivierDriver,
                    },
                }
            )
        assert(responseCreateJourney.body.kind === 'single')
        expect(responseCreateJourney.body.singleResult.data).toEqual({
            createJourney: {
                destination: 'Paris',
                origin: 'Nantes',
                user: {
                    id: olivierDriver?.id,
                },
                availableSeats: 3,
                automaticAccept: true,
            },
        })
    })

    it('should create a booking with status accepted and decrease available seats when auto-accept is enabled', async () => {
        const resolversContextValue = {
            userService: new UserService(),
            journeyService: new JourneyService(),
            bookingService: new BookingService(),
        }
        const responseListJourneys =
            await server.executeOperation<ResponseListJourneys>(
                {
                    query: LIST_JOURNEYS,
                },
                {
                    contextValue: resolversContextValue,
                }
            )

        assert(responseListJourneys.body.kind === 'single')

        const journeyBeforeBooking =
            responseListJourneys.body.singleResult.data?.listJourneys[0]

        assert(journeyBeforeBooking?.automaticAccept === true)

        const responseCreateBooking =
            await server.executeOperation<ResponseCreateBooking>(
                {
                    query: CREATE_BOOKING,
                    variables: {
                        data: {
                            user: {
                                id: marielouPassenger?.id,
                            },
                            journey: {
                                id: journeyBeforeBooking?.id,
                            },
                            nbPassenger: 1,
                        },
                    },
                },
                {
                    contextValue: {
                        ...resolversContextValue,
                        user: marielouPassenger,
                    },
                }
            )

        assert(responseCreateBooking.body.kind === 'single')

        expect(responseCreateBooking.body.singleResult.data).toEqual({
            createBooking: {
                user: {
                    id: marielouPassenger?.id,
                },
                status: 'ACCEPTED',
                journey: {
                    id: journeyBeforeBooking?.id,
                },
            },
        })

        const responseFindJourneyById =
            await server.executeOperation<ResponseFindJourneyById>(
                {
                    query: FIND_JOURNEY_BY_ID,
                    variables: {
                        findJourneyByIdId: journeyBeforeBooking?.id,
                    },
                },
                {
                    contextValue: {
                        ...resolversContextValue,
                        user: marielouPassenger,
                    },
                }
            )
        assert(responseFindJourneyById.body.kind === 'single')
        expect(
            responseFindJourneyById.body.singleResult.data?.findJourneyById
                ?.availableSeats
        ).toEqual(journeyBeforeBooking.availableSeats - 1)
    })

    it('should prevent a user from booking his own journey', async () => {
        const resolversContextValue = {
            userService: new UserService(),
            journeyService: new JourneyService(),
            bookingService: new BookingService(),
        }

        const responseListJourneys =
            await server.executeOperation<ResponseListJourneys>(
                {
                    query: LIST_JOURNEYS,
                },
                {
                    contextValue: resolversContextValue,
                }
            )
        assert(responseListJourneys.body.kind === 'single')

        const journey =
            responseListJourneys.body.singleResult.data?.listJourneys[0]

        const responseCreateBooking = await server.executeOperation(
            {
                query: CREATE_BOOKING,
                variables: {
                    data: {
                        user: {
                            id: olivierDriver?.id,
                        },
                        journey: {
                            id: journey?.id,
                        },
                        nbPassenger: 2,
                    },
                },
            },
            { contextValue: { ...resolversContextValue, user: olivierDriver } }
        )

        assert(responseCreateBooking.body.kind === 'single')
        expect(
            responseCreateBooking.body.singleResult.errors?.[0].message
        ).toEqual('Vous ne pouvez pas réserver votre propre trajet')
    })

    it('should prevent a user from booking a journey for another user', async () => {
        const resolversContextValue = {
            userService: new UserService(),
            journeyService: new JourneyService(),
            bookingService: new BookingService(),
        }

        const responseListJourneys =
            await server.executeOperation<ResponseListJourneys>(
                {
                    query: LIST_JOURNEYS,
                },
                {
                    contextValue: resolversContextValue,
                }
            )
        assert(responseListJourneys.body.kind === 'single')

        const journey =
            responseListJourneys.body.singleResult.data?.listJourneys[0]

        const responseCreateBooking = await server.executeOperation(
            {
                query: CREATE_BOOKING,
                variables: {
                    data: {
                        user: {
                            id: asmaUser?.id,
                        },
                        journey: {
                            id: journey?.id,
                        },
                        nbPassenger: 2,
                    },
                },
            },
            {
                contextValue: {
                    ...resolversContextValue,
                    user: marielouPassenger,
                },
            }
        )

        assert(responseCreateBooking.body.kind === 'single')
        const { errors } = responseCreateBooking.body.singleResult
        expect(errors).toBeDefined()
        expect(errors?.[0].message).toBe('Accès non autorisé')
    })
})
