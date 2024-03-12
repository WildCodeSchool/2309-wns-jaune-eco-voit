import { UserEntity } from '../entities/user.entity'

export const userAuthorized = (usersId: string[], user: UserEntity | null) => {
    if (user && user?.role !== 'ADMIN' && !usersId.includes(user?.id))
        throw new Error('Accès non autorisé')
}

// Journey user id '638ce0ce-0ff1-4031-a2b0-6c3c8a519db6'
// Journey id "176d017c-14d6-4835-9581-74bc09c9299b"
