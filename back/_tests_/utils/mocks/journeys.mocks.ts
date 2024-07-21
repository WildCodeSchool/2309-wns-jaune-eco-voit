import { JourneyEntity } from '../../../src/entities/journey.entity'

export const journeysData: Omit<JourneyEntity, 'user'>[] = [
    {
        departureTime: new Date('2024-10-07T14:48:00.000Z'),
        availableSeats: 1,
        automaticAccept: false,
        arrivalTime: new Date('2024-10-07T19:48:00.000Z'),
        createdAt: new Date('2024-03-12T13:46:48.144Z'),
        destination: 'Lyon',
        id: 'dd78cf00-e747-4eee-8ac4-353b3e5820d0',
        origin: 'Paris',
        status: 'DONE',
        price: 50,
    },
    {
        departureTime: new Date('2024-10-05T14:48:00.000Z'),
        availableSeats: 1,
        automaticAccept: true,
        arrivalTime: new Date('2024-10-05T23:48:00.000Z'),
        createdAt: new Date('2024-03-12T13:46:48.144Z'),
        destination: 'Marseille',
        id: 'f6a70694-0557-4b5d-b3be-02b83a5f4067',
        origin: 'Paris',
        status: 'CANCELLED',
        price: 50,
    },
]
