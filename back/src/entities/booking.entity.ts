import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm' // Pour définir les entités TypeORM
import {
    Field,
    GraphQLISODateTime,
    ID,
    InputType,
    ObjectType,
} from 'type-graphql' // Pour définir les Types GraphQL

import { IsInt, Max, Min } from 'class-validator'

import { UserEntity } from './user.entity'
import { JourneyEntity } from './journey.entity'

export type Status =
    | 'PENDING'
    | 'REJECTED'
    | 'CANCELLED'
    | 'ACCEPTED'
    | 'DONE'
    | 'RATED'

@ObjectType()
@Entity()
export class BookingEntity {
    @Field(() => ID) // pour GraphQL
    @PrimaryGeneratedColumn('uuid') // pour TypeORM
    id: string

    @Field()
    @Column({
        type: 'text',
        enum: ['PENDING', 'REJECTED', 'ACCEPTED', 'CANCELLED', 'DONE', 'RATED'],
        default: 'PENDING',
    })
    status: Status // Type créé pour le Statut
    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (u) => u.bookings)
    user: UserEntity

    @Field()
    @Column({ default: 1 })
    @IsInt({ message: 'Le nombre de passager doit être un nombre' })
    @Min(1)
    @Max(8, { message: 'Le nombre maximum de passagers est de 8' })
    nbPassenger: number

    @Field(() => JourneyEntity)
    @ManyToOne(() => JourneyEntity, (j) => j.bookings)
    journey: JourneyEntity

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => GraphQLISODateTime, { nullable: true })
    @UpdateDateColumn()
    updatedAt?: Date
}

// --------- INPUTS ------------ //
@ObjectType()
@InputType()
export class PartialBookingInput {
    @Field(() => ID)
    id: string
}

@InputType()
export class CreateBookingInput {
    @Field(() => PartialBookingInput)
    user: PartialBookingInput

    @Field(() => PartialBookingInput)
    journey: PartialBookingInput

    @Field({ nullable: true })
    status?: Status

    @Field()
    nbPassenger: number
}

@InputType()
export class UpdateBookingInput {
    @Field(() => ID)
    id: string

    @Field()
    status: Status
}

@InputType()
export class ListBookingsFilterInput {
    @Field({ nullable: true })
    userId?: string

    @Field({ nullable: true })
    journeyId?: string
}
