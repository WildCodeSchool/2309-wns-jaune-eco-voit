import { Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { VehiculeEntity } from "./vehicule.entity";

type JourneyStatus = "PLANNED" | "CANCELLED" | "DONE";

@ObjectType()
@Entity()
export class JourneyEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  steps: string[];

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.journeys)
  user: UserEntity;

  @Field(() => VehiculeEntity)
  @ManyToOne(() => VehiculeEntity, (vehicule) => vehicule.journeys)
  vehicule: VehiculeEntity;

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

  @Field()
  @CreateDateColumn()
  createdAt: Date;
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
  steps: string[];
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
  steps: string[];
  @Field({ nullable: true })
  status: JourneyStatus;
}
