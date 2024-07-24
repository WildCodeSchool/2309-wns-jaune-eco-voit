import {
    Field,
    GraphQLISODateTime,
    ID,
    InputType,
    ObjectType,
} from 'type-graphql'
import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from './user.entity'
import { BookingEntity } from './booking.entity'
import { IsBoolean, IsDate, IsInt, Length, Max, Min } from 'class-validator'
import { Float } from 'type-graphql'
import { JourneyMessageEntity } from './journeyMessage.entity'

export type JourneyStatus = 'PLANNED' | 'CANCELLED' | 'DONE'

@ObjectType()
@Entity()
export class JourneyEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.journeys /*, {eager: true} */) // eager : permet de faire les relations directement (à mettre d'un côté seulement)
    user: UserEntity

    @Field()
    @Column({ length: 50 })
    @Length(3, 50, {
        message: 'Origin place must be between 3 and 50 characters.',
    })
    origin: string

    @Field()
    @Column()
    originCoordinates: string

    @Field()
    @Column({ length: 50 })
    @Length(3, 50, {
        message: 'Destination place must be between 3 and 50 characters.',
    })
    destination: string

    @Field()
    @Column()
    destinationCoordinates: string

    @Field(() => Float)
    @Column({ type: 'float' })
    @Min(0.1, { message: 'Total price must be greater than zero.' })
    price: number

    @Field()
    @Column('timestamp')
    @IsDate({ message: 'Departure time must be a valide date' })
    departureTime: Date

    @Field()
    @Column('timestamp')
    @IsDate({ message: 'Arrival time must be a valide date' })
    arrivalTime: Date

    @Field()
    @Column()
    @IsInt({ message: 'Avalaible seats must e a number' })
    // Min to 0 cause when the journey will be full, the number of available seats will be 0
    @Min(0)
    @Max(8, { message: 'Max available seats is 8' })
    availableSeats: number

    @Field(() => [BookingEntity])
    @OneToMany(() => BookingEntity, (b) => b.journey)
    bookings?: BookingEntity[]

    @Field(() => [JourneyMessageEntity], { nullable: true })
    @OneToMany(
        () => JourneyMessageEntity,
        (journeyMessage) => journeyMessage.journey
    )
    journeyMessages?: JourneyMessageEntity[]

    @Field()
    @Column({
        type: 'text',
        enum: ['PLANNED', 'CANCELLED', 'DONE'],
        default: 'PLANNED',
    })
    status: JourneyStatus

    @Field()
    @Column({ default: true })
    @IsBoolean({ message: 'AutomaticAccept must be a boolean' })
    automaticAccept: boolean

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => GraphQLISODateTime, { nullable: true })
    @UpdateDateColumn()
    updatedAt?: Date
}

/**============================================
 *?               Inputs
 *=============================================**/

@InputType()
export class PartialUserInput {
    @Field(() => ID)
    id: string
}

@InputType()
export class CreateJourneyInput {
    @Field()
    departureTime: Date

    @Field()
    arrivalTime: Date

    @Field()
    origin: string

    @Field()
    destination: string

    @Field()
    originCoordinates: string

    @Field()
    destinationCoordinates: string

    @Field(() => Float)
    price: number

    @Field()
    automaticAccept: boolean

    @Field(() => PartialUserInput)
    user: PartialUserInput

    @Field()
    availableSeats: number
}

@InputType()
export class UpdateJourneyInput {
    @Field(() => ID)
    id: string

    @Field({ nullable: true })
    departureTime?: Date

    @Field({ nullable: true })
    arrivalTime?: Date

    @Field({ nullable: true })
    origin?: string

    @Field({ nullable: true })
    destination?: string

    @Field({ nullable: true })
    originCoordinates?: string

    @Field({ nullable: true })
    destinationCoordinates?: string

    @Field(() => Float, { nullable: true })
    price?: number

    @Field({ nullable: true })
    automaticAccept?: boolean

    @Field({ nullable: true })
    status?: JourneyStatus

    @Field({ nullable: true })
    availableSeats?: number
}

@InputType()
export class UpdateJourneyStatusInput {
    @Field(() => ID)
    id: string
    @Field()
    status: JourneyStatus
}

@InputType()
export class ListJourneysWithFilters {
    @Field()
    origin: string

    @Field()
    destination: string

    @Field()
    departureTime: Date

    @Field({ nullable: true })
    automaticAccept?: boolean

    @Field()
    availableSeats: number

    @Field({ nullable: true })
    user?: PartialUserInput
}

@InputType()
export class updateAvailableSeatsInput {
    @Field(() => ID)
    id: string

    @Field()
    seatNb: number
}
