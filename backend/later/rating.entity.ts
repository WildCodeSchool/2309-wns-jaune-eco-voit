/*import {
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
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { BookingEntity } from '../src/entities/booking.entity'

export type Rate = '1' | '2' | '3' | '4' | '5'
export type Status = 'ACTIVE' | 'ARCHIVED'

@ObjectType()
@Entity()
export class RatingEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date

    @Field()
    @Column({
        type: 'text',
        enum: ['1', '2', '3', '4', '5'],
    })
    rate: Rate

    @Field()
    @Column('uuid')
    userRated: string

    @Field()
    @Column('uuid')
    userRater: string

    @Field(() => BookingEntity)
    @ManyToOne(() => BookingEntity, (b) => b.ratings)
    booking: BookingEntity
}

@InputType()
export class PartialBookingInput {
    @Field(() => ID)
    id: string
}

@InputType()
export class CreateRatingInput {
    @Field()
    rate: Rate

    @Field()
    userRaterId: PartialBookingInput

    @Field()
    userRatedId: PartialBookingInput

    @Field()
    bookingId: PartialBookingInput
}*/
