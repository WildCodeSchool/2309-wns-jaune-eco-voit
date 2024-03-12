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
    Float,
    GraphQLISODateTime,
    ID,
    InputType,
    ObjectType,
} from 'type-graphql' // Pour définir les Types GraphQL
import { Min, IsDate } from 'class-validator' // to add validators
import { UserEntity } from './user.entity'
import { JourneyEntity } from './journey.entity'

export type Status = 'PENDING' | 'REJECTED' | 'CANCELLED' | 'ACCEPTED'

@ObjectType()
@Entity()
export class BookingEntity {
    @Field(() => ID) // pour GraphQL
    @PrimaryGeneratedColumn('uuid') // pour TypeORM
    id: string

    @Field(() => Float)
    @Column({ type: 'float' })
    @Min(0.1, { message: 'Price must be greater than 0' })
    totalPrice: number

    @Field()
    @Column({ type: 'timestamptz' }) // Recommended for Date  typeORM
    @IsDate({ message: 'Departure time must be a valide date' })
    departureTime: Date

    @Field()
    @Column({ type: 'timestamptz' }) // Recommended for Date  typeORM
    @IsDate({ message: 'Arrival time must be a valide date' })
    arrivalTime: Date

    @Field()
    @Column({
        type: 'text',
        enum: ['PENDING', 'REJECTED', 'ACCEPTED', 'CANCELLED'],
        default: ['PENDING'],
    })
    status: Status // Type créé pour le Statut

    // @Field(() => [StepEntity])
    // @JoinTable()
    // @ManyToMany(() => StepEntity, (s) => s.bookings)
    // steps: StepEntity[];

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (u) => u.bookings)
    user: UserEntity

    @Field(() => JourneyEntity)
    @ManyToOne(() => JourneyEntity, (j) => j.bookings)
    journey: JourneyEntity

    // @Field(() => [RatingEntity])
    // @OneToMany(() => RatingEntity, (rating) => rating.booking)
    // ratings: RatingEntity[];

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
    @Field(() => Float)
    totalPrice: number

    @Field()
    departureTime: Date

    @Field()
    arrivalTime: Date

    @Field(() => PartialBookingInput)
    user: PartialBookingInput

    @Field(() => PartialBookingInput)
    journey: PartialBookingInput

    @Field({ nullable: true })
    status?: Status
}

@InputType()
export class UpdateBookingInput {
    @Field()
    status: Status
}
