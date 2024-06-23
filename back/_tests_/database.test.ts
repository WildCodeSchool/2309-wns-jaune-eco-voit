import { buildSchemaSync } from 'type-graphql'
import UserResolver from '../src/resolvers/user.resolver'
import JourneyResolver from '../src/resolvers/journey.resolver'
import BookingResolver from '../src/resolvers/booking.resolver'
import { ApolloServer } from '@apollo/server'
import assert from 'assert'

import datasource from '../src/db_test'
import initialDatasource from '../src/db'
import UserService from '../src/services/user.service'
import JourneyService from '../src/services/journey.service'
import BookingService from '../src/services/booking.service'
import {
    CreateUserInput,
    UpdateUserInput,
    UserEntity,
} from '../src/entities/user.entity'
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
import { ResponseCreateBooking } from './utils/types/bookings.type'

export interface MyContext {
    userService: UserService
    journeyService: JourneyService
    bookingService: BookingService
}

const baseSchema = buildSchemaSync({
    resolvers: [UserResolver, JourneyResolver, BookingResolver],
    authChecker: () => true,
})

let server: ApolloServer<MyContext>
let marielouPassenger: ResponseRegisterData['register'] | undefined
let olivierDriver: ResponseRegisterData['register'] | undefined

beforeAll(async () => {
    server = new ApolloServer<MyContext>({
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

    await datasource.initialize() //initialisation de la datasource

    const contextValue = {
        userService: new UserService(),
        journeyService: new JourneyService(),
        bookingService: new BookingService(),
    }

    const createUser = async (data: CreateUserInput) => {
        return server.executeOperation<ResponseRegisterData>(
            {
                query: REGISTER,
                variables: {
                    data,
                },
            },
            {
                contextValue,
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
})

afterAll(async () => {
    await datasource.dropDatabase() //suppression de la base de donnée
})

describe('Test sur une base de donnée de test', () => {
    it('should update user', async () => {
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
                    journeyService: new JourneyService(),
                    bookingService: new BookingService(),
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

    it('should create a journey', async () => {
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
                            totalPrice: 35,
                            user: {
                                id: olivierDriver?.id,
                            },
                        },
                    },
                },
                {
                    contextValue: {
                        userService: new UserService(),
                        journeyService: new JourneyService(),
                        bookingService: new BookingService(),
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
            },
        })
    })

    it('should create a booking with status accepted and decrease available seats when automatic accept is true', async () => {
        const contextValue = {
            userService: new UserService(),
            journeyService: new JourneyService(),
            bookingService: new BookingService(),
        }
        const responseListJourney =
            await server.executeOperation<ResponseListJourneys>(
                {
                    query: LIST_JOURNEYS,
                },
                {
                    contextValue,
                }
            )

        assert(responseListJourney.body.kind === 'single')

        const journeyBeforeBooking =
            responseListJourney.body.singleResult.data?.listJourneys[0]

        assert(journeyBeforeBooking?.automaticAccept === true)

        // const createBooking = () => {}

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
                    contextValue,
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
                { contextValue }
            )
        assert(responseFindJourneyById.body.kind === 'single')
        expect(
            responseFindJourneyById.body.singleResult.data?.findJourneyById
                ?.availableSeats
        ).toEqual(journeyBeforeBooking.availableSeats - 1)
    })

    it('should not allow a user to book his own journey', async () => {
        const contextValue = {
            userService: new UserService(),
            journeyService: new JourneyService(),
            bookingService: new BookingService(),
        }

        const responseListJourney =
            await server.executeOperation<ResponseListJourneys>(
                {
                    query: LIST_JOURNEYS,
                },
                {
                    contextValue,
                }
            )
        assert(responseListJourney.body.kind === 'single')

        const journey =
            responseListJourney.body.singleResult.data?.listJourneys[0]

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
            { contextValue }
        )
        assert(responseCreateBooking.body.kind === 'single')
        expect(
            responseCreateBooking.body.singleResult.errors?.[0].message
        ).toEqual('Vous ne pouvez pas réserver votre propre trajet')
    })
})
