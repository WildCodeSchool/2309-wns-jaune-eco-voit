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
import { Min } from 'class-validator' // to add validators
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
    @Min(0.1)
    totalPrice: number

    @Field()
    @Column({ type: 'timestamptz' }) // Recommended for Date  typeORM
    departureTime: Date

    @Field()
    @Column({
        type: 'text',
        enum: ['PENDING', 'REJECTED', 'ACCEPTED', 'CANCELLED'],
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

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date
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
    status: Status

    @Field()
    steps: PartialBookingInput[]

<<<<<<< HEAD
    @Field()
    user: PartialBookingInput

    @Field()
    journey: PartialBookingInput
=======
  @Field(() => PartialBookingInput)
  user: PartialBookingInput;

  @Field(() => PartialBookingInput)
  journey: PartialBookingInput;
>>>>>>> dc9b5eec (fin)
}

@InputType()
export class UpdateBookingInput {
    @Field()
    status: Status
}
