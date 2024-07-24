import { UserEntity } from '../../../src/entities/user.entity'

export const usersData: Omit<
    UserEntity,
    'hashPassword' | 'ratings' | 'averageRate'
>[] = [
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
