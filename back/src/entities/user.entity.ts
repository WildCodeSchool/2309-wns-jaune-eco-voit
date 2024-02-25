import {
    Field,
    GraphQLISODateTime,
    ID,
    InputType,
    ObjectType,
} from 'type-graphql'
import {
    BeforeInsert,
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
import argon2 from 'argon2'

export type Role = 'USER' | 'ADMIN'
export type Grade = 'BEGINNER' | 'CONFIRMED' | 'AMBASSADOR'
export type Status = 'ARCHIVED' | 'ACTIVE'

@ObjectType()
@Entity()
export class UserEntity {
    @BeforeInsert()
    protected async beforeInsert() {
        this.password = await argon2.hash(this.password)
    }
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
    @Column({ length: 50, unique: true })
    email: string

    @Field()
    @Column()
    password: string

    @Field(() => GraphQLISODateTime)
    @Column({ type: 'timestamptz' })
    dateOfBirth: Date

    @Field(() => GraphQLPhoneNumber, { nullable: true })
    @Column({ nullable: true })
    phoneNumber?: string

    @Field({ nullable: true })
    @Column({ nullable: true })
    profilPicture?: string

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

    @Field(() => GraphQLISODateTime, { nullable: true })
    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date

    // @Field(() => [AddressEntity])
    // @OneToMany(() => AddressEntity, (a) => a.user)
    // addresses: AddressEntity[];

    @Field(() => [JourneyEntity], { nullable: true })
    @OneToMany(() => JourneyEntity, (j) => j.user)
    journeys?: JourneyEntity[]

    // @Field(() => [RatingEntity])
    // @OneToMany(() => RatingEntity, (r) => r.booking)
    // ratings: RatingEntity[];

    @Field(() => [BookingEntity], { nullable: true })
    @OneToMany(() => BookingEntity, (b) => b.user)
    bookings?: BookingEntity[]

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
    @Field(() => GraphQLISODateTime)
    dateOfBirth: Date
    @Field({ nullable: true })
    phoneNumber?: string
    @Field({ nullable: true })
    profilePicture?: string
    @Field({ nullable: true })
    role?: Role
}

@InputType()
export class UpdateUserInput {
    @Field(() => ID)
    id: string
    @Field({ nullable: true })
    firstname?: string
    @Field({ nullable: true })
    lastname?: string
    @Field(() => GraphQLEmailAddress, { nullable: true })
    email?: string
    @Field({ nullable: true })
    password?: string
    @Field(() => GraphQLISODateTime, { nullable: true })
    dateOfBirth?: Date
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
export class LoginInput {
    @Field()
    email: string
    @Field()
    password: string
}

@ObjectType()
export class UserMessage {
    @Field()
    success: boolean

    @Field()
    message: string

    constructor(success: boolean, message: string) {
        this.success = success
        this.message = message
    }
}

@ObjectType()
export class UserWithoutPassord
    implements Pick<UserEntity, 'email' | 'firstname' | 'lastname'>
{
    @Field()
    firstname: string

    @Field()
    lastname: string

    @Field(() => GraphQLEmailAddress)
    email: string
}
