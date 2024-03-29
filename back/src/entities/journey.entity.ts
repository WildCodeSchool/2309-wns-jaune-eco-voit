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
// import { VehiculeEntity } from "../../later/vehicule.entity";
import { UserEntity } from './user.entity'
// import { MessageEntity } from "../../later/message.entity";
// import { StepEntity } from "../../later/step.entity";
import { BookingEntity } from './booking.entity'
import { IsBoolean, IsDate, IsInt, Length, Max, Min } from 'class-validator'
import { Float } from 'type-graphql'

export type JourneyStatus = 'PLANNED' | 'CANCELLED' | 'DONE'

@ObjectType()
@Entity()
export class JourneyEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.journeys)
    user: UserEntity

    // @Field(() => VehiculeEntity)
    // @ManyToOne(() => VehiculeEntity, (v) => v.journeys)
    // vehicule: VehiculeEntity;

    // @Field(() => [MessageEntity])
    // @OneToMany(() => MessageEntity, (m) => m.journey)
    // messages: MessageEntity[];

    // @Field(() => [StepEntity])
    // @OneToMany(() => StepEntity, (s) => s.journey)
    // steps: StepEntity[];

    @Field()
    @Column({ length: 50 })
    @Length(3, 50, {
        message: 'Origin place must be between 3 and 50 characters.',
    })
    origin: string

    @Field()
    @Column({ length: 50 })
    @Length(3, 50, {
        message: 'Destination place must be between 3 and 50 characters.',
    })
    destination: string

    @Field(() => Float)
    @Column({ type: 'float' })
    @Min(0.1, { message: 'Total price must be greater than zero.' })
    totalPrice: number

    @Field()
    @Column('timestamp')
    @IsDate({ message: 'Departure time must be a valide date' })
    departure_time: Date

    @Field()
    @Column('timestamp')
    @IsDate({ message: 'Arrival time must be a valide date' })
    arrival_time: Date

    @Field()
    @Column()
    @IsInt({ message: 'Avalaible seats must e a number' })
    // Min to 0 cause when the journey will be full, the number of available seats will be 0
    @Min(0)
    @Max(4, { message: 'Max available seats is 4' })
    availableSeats: number

    @Field(() => [BookingEntity])
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

// Ne pas oublier d'enlever les commentaires
// @InputType()
// export class PartialVehiculeInput {
//   @Field(() => ID)
//   id: string;
// }

@InputType()
export class PartialUserInput {
    @Field(() => ID)
    id: string
}

@InputType()
export class CreateJourneyInput {
    // @Field()
    // vehicule: PartialVehiculeInput;

    @Field()
    departure_time: Date

    @Field()
    arrival_time: Date

    @Field()
    origin: string

    @Field()
    destination: string

    @Field(() => Float)
    totalPrice: number

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
    departure_time?: Date

    @Field({ nullable: true })
    arrival_time?: Date

    @Field({ nullable: true })
    origin?: string

    @Field({ nullable: true })
    destination?: string

    @Field(() => Float, { nullable: true })
    totalPrice?: number

    @Field({ nullable: true })
    automaticAccept?: boolean

    @Field({ nullable: true })
    status?: JourneyStatus

    @Field({ nullable: true })
    availableSeats?: number

    // vehicule: PartialVehiculeInput;
}

@InputType()
export class UpdateJourneyStatusInput {
    @Field(() => ID)
    id: string
    @Field()
    status: JourneyStatus
}
