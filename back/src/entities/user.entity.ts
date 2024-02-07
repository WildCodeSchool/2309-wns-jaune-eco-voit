import {
    Field,
    GraphQLISODateTime,
    ID,
    InputType,
    ObjectType,
} from 'type-graphql'
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { JourneyEntity } from './journey.entity'
import { BookingEntity } from './booking.entity'
import { GraphQLEmailAddress, GraphQLPhoneNumber } from 'graphql-scalars'

export type Role = 'USER' | 'ADMIN'
export type Grade = 'BEGINNER' | 'CONFIRMED' | 'AMBASSADOR'
export type Status = 'ARCHIVED' | 'ACTIVE'

@ObjectType()
@Entity()
export class UserEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field()
    @Column({ length: 50 })
    firstname: string

    @Field()
    @Column({ length: 50 })
    lastname: string

    @Field(() => GraphQLEmailAddress)
    @Column({ length: 50 })
    email: string

    @Field()
    @Column()
    password: string

    @Field(() => GraphQLISODateTime)
    @Column({ type: 'timestamptz' })
    dateOfBirth: Date

    @Field(() => GraphQLPhoneNumber)
    @Column()
    phoneNumber: string

    @Field()
    @Column()
    profilPicture: string

    @Field()
    @Column({
        type: 'text',
        enum: ['ADMIN', 'USER'],
        default: 'USER',
    })
    role: Role

    @Field()
    @Column({
        type: 'text',
        enum: ['BEGINNER', 'CONFIRMED', 'AMBASSADOR'],
        default: 'BEGINNER',
    })
    grade: Grade

    @Field()
    @Column({ default: 0 })
    tripsAsPassenger: number

    @Field()
    @Column({ default: 0 })
    tripsAsDriver: number

    @Field()
    @Column({
        type: 'text',
        enum: ['ACTIVE', 'ARCHIVED'],
        default: 'ACTIVE',
    })
    status: Status

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date

    // @Field(() => [AddressEntity])
    // @OneToMany(() => AddressEntity, (a) => a.user)
    // addresses: AddressEntity[];

    @Field(() => JourneyEntity)
    @OneToMany(() => JourneyEntity, (j) => j.user)
    journeys: JourneyEntity[]

    // @Field(() => [RatingEntity])
    // @OneToMany(() => RatingEntity, (r) => r.booking)
    // ratings: RatingEntity[];

    @Field(() => [BookingEntity])
    @OneToMany(() => BookingEntity, (b) => b.user)
    bookings: BookingEntity[]

    // @Field(() => [VehiculeEntity])
    // @OneToMany(() => VehiculeEntity, (v) => v.user)
    // vehicules: VehiculeEntity[];

    // @Field(() => [MessageEntity])
    // @OneToMany(() => MessageEntity, (m) => m.user)
    // messages: MessageEntity[];
}

// -------------- INPUTS -------------- //

@InputType()
export class CreateUserInput {
    @Field()
    firstname: string
    @Field()
    lastname: string
    @Field()
    email: string
    @Field()
    password: string
    @Field()
    dateOfBirth: string
    @Field({ nullable: true })
    phoneNumber: string
    @Field({ nullable: true })
    profilePicture: string
    @Field({ nullable: true })
    role: Role
}

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    firstname?: string
    @Field({ nullable: true })
    lastname?: string
    @Field(() => GraphQLEmailAddress, { nullable: true })
    email?: string
    @Field({ nullable: true })
    password?: string
    @Field({ nullable: true })
    dateOfBirth?: string
    @Field(() => GraphQLPhoneNumber, { nullable: true })
    phoneNumber?: string
    @Field({ nullable: true })
    profilePicture?: string
    @Field({ nullable: true })
    role?: Role
    @Field({ nullable: true })
    grade?: Grade
    @Field({ nullable: true })
    status?: Status
    @Field({ nullable: true })
    tripsAsPassenger?: number
    @Field({ nullable: true })
    tripsAsDriver?: number
}

@InputType()
export class UpdateUserInputId extends UpdateUserInput {
    @Field(() => ID)
    id: string
}

@InputType()
export class LoginInput {
    @Field()
    email: string
    password: string
}

@ObjectType()
export class UserMessage {
    @Field()
    success: boolean

    @Field()
    message: string
}

@ObjectType()
export class UserWithoutPassord implements Pick<UserEntity, 'email'> {
    @Field(() => GraphQLEmailAddress)
    email: string
}
