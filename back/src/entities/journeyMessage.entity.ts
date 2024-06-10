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
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from './user.entity'
import { Length } from 'class-validator'
import { JourneyEntity, PartialUserInput } from './journey.entity'

@ObjectType()
@Entity()
export class JourneyMessageEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.journeyMessages)
    user: UserEntity

    @Field(() => JourneyEntity)
    @ManyToOne(() => JourneyEntity, (journey) => journey.journeyMessages)
    journey: JourneyEntity

    @Field()
    @Column({ length: 200 })
    @Length(3, 200, {
        message: 'Message must be less than 200 characters.',
    })
    message: string

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
export class PartialJourneyInput {
    @Field(() => ID)
    id: string
}

@InputType()
export class CreateJourneyMessageInput {
    @Field(() => PartialUserInput)
    user: PartialUserInput

    @Field(() => PartialJourneyInput)
    journey: PartialJourneyInput

    @Field()
    message: string
}
