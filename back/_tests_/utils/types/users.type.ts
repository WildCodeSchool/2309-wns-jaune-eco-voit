import { UserEntity } from '../../../src/entities/user.entity'

export type ResponseRegisterData = {
    register: {
        email: string
        id: string
        firstname: string
        lastname: string
    }
}

export type ResponseListUsers = {
    listUsers: UserEntity[]
}

export type ResponseUpdateUser = { updatedUser: UserEntity }

export type ResponseFindUserById = {
    findUserById: UserEntity
}
