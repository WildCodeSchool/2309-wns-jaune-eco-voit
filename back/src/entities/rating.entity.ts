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
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { BookingEntity, PartialBookingInput } from './booking.entity'
import { UserEntity } from './user.entity'
import { PartialUserInput } from './journey.entity'

export type Rate = '1' | '2' | '3' | '4' | '5'
export type Status = 'ACTIVE' | 'ARCHIVED'

@ObjectType()
@Entity()
export class RatingEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field()
    @Column({
        type: 'text',
        enum: ['1', '2', '3', '4', '5'],
    })
    rate: Rate

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (u) => u.ratings)
    // @Column('uuid')
    userRated: UserEntity

    @Field(() => BookingEntity)
    @OneToOne(() => BookingEntity)
    @JoinColumn()
    booking: BookingEntity

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date
}

@InputType()
export class CreateRatingInput {
    @Field()
    rate: Rate

    @Field(() => PartialUserInput)
    userRated: PartialUserInput

    @Field(() => PartialBookingInput)
    booking: PartialBookingInput
}
