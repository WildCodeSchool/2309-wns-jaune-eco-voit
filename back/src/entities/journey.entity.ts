import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  ObjectType,
} from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { VehiculeEntity } from "./vehicule.entity";
import { UserEntity } from "./user.entity";
import { MessageEntity } from "./message.entity";
import { StepEntity } from "./step.entity";
import { BookingEntity } from "./booking.entity";

type JourneyStatus = "PLANNED" | "CANCELLED" | "DONE";

@ObjectType()
@Entity()
export class JourneyEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (u) => u.journeys)
  user: UserEntity;

  @Field(() => VehiculeEntity)
  @ManyToOne(() => VehiculeEntity, (v) => v.journeys)
  vehicule: VehiculeEntity;

  @Field(() => [MessageEntity])
  @OneToMany(() => MessageEntity, (m) => m.journey)
  messages: MessageEntity[];

  @Field(() => [StepEntity])
  @OneToMany(() => StepEntity, (s) => s.journey)
  steps: StepEntity[];

  @Field(() => [BookingEntity])
  @OneToMany(() => BookingEntity, (b) => b.journey)
  bookings: BookingEntity[];

  @Field()
  @Column({
    type: "text",
    enum: ["PLANNED", "CANCELLED", "DONE"],
    default: ["PLANNED"],
  })
  status: JourneyStatus;

  @Field()
  @Column()
  automaticAccept: boolean;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;
}

/**============================================
 *?               Inputs
 *=============================================**/
@InputType()
export class PartialVehiculeInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class PartialUserInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class CreateJourneyInput {
  @Field()
  vehicule: PartialVehiculeInput;
  @Field()
  user: PartialUserInput;
  @Field()
  automaticAccept: boolean;
}

@InputType()
export class UpdateJourneyInput {
  @Field({ nullable: true })
  status: JourneyStatus;
  vehicule: PartialVehiculeInput;
}
