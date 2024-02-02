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

type VehiculeStatus = "ARCHIVE" | "ACTIVE";

@ObjectType()
@Entity()
export class VehiculeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ length: 10 })
  @Length(10, 10, {
    message: "La plaque d'immatriculation doit avoir une length de 10",
  })
  registration: string;

  @Field()
  @Column({ length: 50 })
  brand: string;

  @Field()
  @Column({ length: 50 })
  model: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.vehicules)
  user: UserEntity;

  @Field(() => JourneyEntity)
  @OneToMany(() => JourneyEntity, (journey) => journey.vehicule)
  journeys: JourneyEntity[];

  @Field()
  @Column({
    type: "text",
    enum: ["ARCHIVE", "ACTIVE"],
    default: "ACTIVE",
  })
  status: VehiculeStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}

/**============================================
 *?               Inputs
 *=============================================**/
@InputType()
export class CreateVehiculeInput {
  @Field()
  registration: string;
  @Field()
  brand: string;
  @Field()
  model: string;
}

@InputType()
export class UpdateVehiculeInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  registration: string;
  @Field({ nullable: true })
  brand: string;
  @Field({ nullable: true })
  model: string;
}
