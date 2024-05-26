import { buildSchemaSync } from 'type-graphql'
import UserResolver from '../src/resolvers/user.resolver'
import { ApolloServer } from '@apollo/server'
import { UserEntity } from '../src/entities/user.entity'
import assert from 'assert'

import datasource from '../src/db_test'
import initialDatasource from '../src/db'

import JourneyResolver from '../src/resolvers/journey.resolver'
import { JourneyEntity } from '../src/entities/journey.entity'
import { EntityTarget, Repository } from 'typeorm'
import { BookingEntity } from '../src/entities/booking.entity'
import BookingResolver from '../src/resolvers/booking.resolver'
import {
    ResponseRegisterData,
    ResponseUpdateUser,
} from './utils/types/users.type'
import {
    REGISTER,
    UPDATE_USER,
} from './utils/requetes/mutations/user.mutations'
import {
    ResponseCreateJourney,
    ResponseFindJourneyById,
    ResponseListJourneys,
} from './utils/types/journeys.type'
import {
    FIND_JOURNEY_BY_ID,
    LIST_JOURNEYS,
} from './utils/requetes/queries/journeys.queries'
import { ResponseCreateBooking } from './utils/types/bookings.type'
import { CREATE_BOOKING } from './utils/requetes/mutations/bookings.mutations'
import { CREATE_JOURNEY } from './utils/requetes/mutations/journeys.mutations'

const baseSchema = buildSchemaSync({
    resolvers: [UserResolver, JourneyResolver, BookingResolver],
    authChecker: () => true,
})

let server: ApolloServer
let olivierDriver: ResponseRegisterData['register'] | null | undefined
let marielouPassenger: ResponseRegisterData['register'] | null | undefined

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

    await datasource.initialize() //initialisation de la datasource

    const olivierResponse = await server.executeOperation<ResponseRegisterData>(
        {
            query: REGISTER,
            variables: {
                data: {
                    email: 'olivier@yopmail.fr',
                    firstname: 'Oliv',
                    lastname: 'Ier',
                    dateOfBirth: new Date('1985-02-08T00:00:00.698Z'),
                    password: 'password',
                    role: 'USER',
                },
            },
        }
    )

    assert(olivierResponse.body.kind === 'single')

    olivierDriver = olivierResponse.body.singleResult.data?.register

    const marielouResponse =
        await server.executeOperation<ResponseRegisterData>({
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
        })

    assert(marielouResponse.body.kind === 'single')

    marielouPassenger = marielouResponse.body.singleResult.data?.register
})
afterAll(async () => {
    await datasource.dropDatabase() //suppression de la base de donnée
})

describe('Test sur une base de donnée de test', () => {
    it('should update user', async () => {
        const response = await server.executeOperation<ResponseUpdateUser>({
            query: UPDATE_USER,
            variables: {
                data: {
                    id: marielouPassenger?.id,
                    lastname: 'Loulou',
                },
            },
        })

        assert(response.body.kind === 'single')

        console.log(marielouPassenger)

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
            await server.executeOperation<ResponseCreateJourney>({
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
            })

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
        const responseListJourney =
            await server.executeOperation<ResponseListJourneys>({
                query: LIST_JOURNEYS,
            })

        assert(responseListJourney.body.kind === 'single')

        const journeyBeforeBooking =
            responseListJourney.body.singleResult.data?.listJourneys[0]

        assert(journeyBeforeBooking?.automaticAccept === true)

        const responseCreateBooking =
            await server.executeOperation<ResponseCreateBooking>({
                query: CREATE_BOOKING,
                variables: {
                    data: {
                        user: {
                            id: marielouPassenger?.id,
                        },
                        totalPrice: journeyBeforeBooking?.totalPrice,
                        journey: {
                            id: journeyBeforeBooking?.id,
                        },
                        arrivalTime: journeyBeforeBooking?.arrival_time,
                        departureTime: journeyBeforeBooking?.departure_time,
                    },
                },
            })

        assert(responseCreateBooking.body.kind === 'single')

        expect(responseCreateBooking.body.singleResult.data).toEqual({
            createBooking: {
                user: {
                    id: marielouPassenger?.id,
                },
                totalPrice: journeyBeforeBooking?.totalPrice,
                status: 'ACCEPTED',
                journey: {
                    id: journeyBeforeBooking?.id,
                },
            },
        })

        const responseFindJourneyById =
            await server.executeOperation<ResponseFindJourneyById>({
                query: FIND_JOURNEY_BY_ID,
                variables: {
                    findJourneyByIdId: journeyBeforeBooking?.id,
                },
            })

        assert(responseFindJourneyById.body.kind === 'single')

        expect(
            responseFindJourneyById.body.singleResult.data?.findJourneyById
                ?.availableSeats
        ).toEqual(journeyBeforeBooking.availableSeats - 1)
    })

    it('should not allow a user to book his own journey', async () => {
        const responseListJourney =
            await server.executeOperation<ResponseListJourneys>({
                query: LIST_JOURNEYS,
            })

        assert(responseListJourney.body.kind === 'single')

        const journey =
            responseListJourney.body.singleResult.data?.listJourneys[0]

        const responseCreateBooking =
            await server.executeOperation<ResponseCreateBooking>({
                query: CREATE_BOOKING,
                variables: {
                    data: {
                        user: {
                            id: olivierDriver?.id,
                        },
                        totalPrice: journey?.totalPrice,
                        journey: {
                            id: journey?.id,
                        },
                        arrivalTime: journey?.arrival_time,
                        departureTime: journey?.departure_time,
                    },
                },
            })

        assert(responseCreateBooking.body.kind === 'single')

        expect(
            responseCreateBooking.body.singleResult.errors?.[0].message
        ).toEqual("You can't book your own journey")

        console.log(JSON.stringify(responseCreateBooking.body.singleResult))
    })
})
