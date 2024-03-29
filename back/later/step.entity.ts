/*import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinTable,
    ManyToMany,
    UpdateDateColumn,
} from 'typeorm'
import {
    Field,
    ObjectType,
    ID,
    Float,
    Int,
    InputType,
    GraphQLISODateTime,
} from 'type-graphql'

import { JourneyEntity } from '../src/entities/journey.entity'
import { BookingEntity } from '../src/entities/booking.entity'

export type StepStatus = 'ACTIVE' | 'ARCHIVED'

@ObjectType()
@Entity()
export class StepEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field(() => Float)
    @Column('float')
    price: number

    @Field()
    @Column({ length: 50 })
    origin: string

    @Field()
    @Column({ length: 50 })
    destination: string

    @Field()
    @Column('timestamp')
    departure_time: Date

    @Field()
    @Column('timestamp')
    arrival_time: Date

    @Field(() => ID)
    @Column('uuid')
    journey_id: string

    @Field(() => Int)
    @Column('int')
    available_seats: number

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date

    @Field()
    @Column({
        type: 'text',
        enum: ['ACTIVE', 'ARCHIVED'],
    })
    status: StepStatus

    @Field(() => JourneyEntity)
    @ManyToOne(() => JourneyEntity, (j) => j.steps)
    journey: JourneyEntity

    @Field(() => [BookingEntity])
    @JoinTable()
    @ManyToMany(() => BookingEntity, (b) => b.steps)
    bookings: BookingEntity[]
}

// ----- INPUT-----
@InputType()
export class PartialJourneyInput {
    @Field(() => ID)
    id: string
}

// CREATE
@InputType()
export class CreateStepInput {
    @Field(() => Float)
    price: number

    @Field()
    origin: string

    @Field()
    destination: string

    @Field()
    departure_time: Date

    @Field()
    arrival_time: Date

    @Field(() => ID)
    journey_id: string

    @Field(() => Int)
    available_seats: number

    @Field()
    journey: PartialJourneyInput
}

// UPDATE
@InputType()
export class UpdateStepInput {
    @Field(() => Float, { nullable: true })
    price?: number

    @Field({ nullable: true })
    origin?: string

    @Field({ nullable: true })
    destination?: string

    @Field({ nullable: true })
    departure_time?: Date

    @Field({ nullable: true })
    arrival_time?: Date

    @Field(() => Int, { nullable: true })
    available_seats?: number

    @Field({ nullable: true })
    StepStatus: StepStatus
}
*/
