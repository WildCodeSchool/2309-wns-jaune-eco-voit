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
import { VehiculeEntity } from "../../later/vehicule.entity";
import { UserEntity } from "./user.entity";
import { MessageEntity } from "../../later/message.entity";
import { StepEntity } from "../../later/step.entity";
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
  origin: string;

  @Field()
  @Column({ length: 50 })
  destination: string;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column("timestamp")
  departure_time: Date;

  @Field()
  @Column("timestamp")
  arrival_time: Date;

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

// Ne pas oublier d'enlever les commentaires
// @InputType()
// export class PartialVehiculeInput {
//   @Field(() => ID)
//   id: string;
// }

@InputType()
export class PartialUserInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class CreateJourneyInput {
  // @Field()
  // vehicule: PartialVehiculeInput;

  @Field()
  departure_time: Date;

  @Field()
  arrival_time: Date;

  @Field()
  origin: string;

  @Field()
  destination: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  automaticAccept: boolean;

  @Field()
  user: PartialUserInput;
}

@InputType()
export class UpdateJourneyInput {

  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  departure_time: Date;

  @Field({ nullable: true })
  arrival_time: Date;

  @Field({ nullable: true })
  origin: string;

  @Field({ nullable: true })
  destination: string;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  automaticAccept: boolean;

  // vehicule: PartialVehiculeInput;
}
