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

type JourneyStatus = 'PLANNED' | 'CANCELLED' | 'DONE'

@ObjectType()
@Entity()
export class JourneyEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (u) => u.journeys)
    user: UserEntity

    // @Field(() => VehiculeEntity)
    // @ManyToOne(() => VehiculeEntity, (v) => v.journeys)
    // vehicule: VehiculeEntity

    // @Field(() => [MessageEntity])
    // @OneToMany(() => MessageEntity, (m) => m.journey)
    // messages: MessageEntity[]

    // @Field(() => [StepEntity])
    // @OneToMany(() => StepEntity, (s) => s.journey)
    // steps: StepEntity[];

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

    @Field(() => [BookingEntity], { nullable: true })
    @OneToMany(() => BookingEntity, (b) => b.journey)
    bookings?: BookingEntity[]

    @Field()
    @Column({
        type: 'text',
        enum: ['PLANNED', 'CANCELLED', 'DONE'],
        default: ['PLANNED'],
    })
    status: JourneyStatus

    @Field()
    @Column()
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
export class PartialVehiculeInput {
    @Field(() => ID)
    id: string
}

@InputType()
export class PartialUserInput {
    @Field(() => ID)
    id: string
}

@InputType()
export class CreateJourneyInput {
    @Field()
    vehicule: PartialVehiculeInput
    @Field()
    user: PartialUserInput
    @Field()
    automaticAccept: boolean
}

@InputType()
export class UpdateJourneyInput {
    @Field({ nullable: true })
    status: JourneyStatus
    vehicule: PartialVehiculeInput
}
