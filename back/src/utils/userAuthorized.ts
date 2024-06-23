import { UserEntity } from '../entities/user.entity'

export const userAuthorized = (usersId: string[], user: UserEntity | null) => {
    if (user && user?.role !== 'ADMIN' && !usersId.includes(user?.id))
        throw new Error('Accès non autorisé')
}
