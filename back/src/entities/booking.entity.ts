import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from "typeorm"; // Pour définir les entités TypeORM
import { Field, Float, ID, InputType, ObjectType } from "type-graphql"; // Pour définir les Types GraphQL
import { Length, Min, min } from "class-validator"; // to add validators

export type Status = "PENDING" | "REJECTED" | "CANCELLED" | "ACCEPTED";

@ObjectType() //pour TypeGraphQL
@Entity() // pour TypeORM
export class BookingEntity {
  @Field(() => ID) // pour GraphQL
  @PrimaryGeneratedColumn("uuid") // pour TypeORM
  id: string;

  @Field(() => Float)
  @Column({ type: "float" })
  @Min(0.1)
  totalPrice: number;

  @Field()
  @Column({ type: "timestamptz" }) // Recommended for Date  typeORM
  departureTime: Date;

  //To add an ENUM to a field use options in @Column()
  @Field()
  @Column({
    type: "text",
    enum: ["PENDING", "REJECTED", "ACCEPTED", "CANCELLED"],
  })
  status: Status; // Type créé pour le Statut

  @Field(() => [StepEntity])
  @JoinTable()
  @ManyToMany(() => StepEntity, (step) => step.bookings)
  steps: StepEntity[];

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.bookings)
  user: UserEntity;

  @Field(() => JourneyEntity)
  @ManyToOne(() => JourneyEntity, (journey) => journey.bookings)
  journey: JourneyEntity;

  @Field(() => [RatingEntity])
  @OneToMany(() => RatingEntity, (rating) => rating.booking)
  ratings: RatingEntity[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}

// --------- INPUTS ------------ //
@InputType()
export class PartialStepInput {
  @Field(() => ID)
  id: string;
}
@InputType()
export class PartialUserInput {
  @Field(() => ID)
  id: string;
}
@InputType()
export class PartialJourneyInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class CreateBookingInput {
  @Field(() => Float)
  totalPrice: number;

  @Field()
  departureTime: Date;

  @Field()
  status: Status;

  @Field()
  steps: PartialStepInput[];

  @Field()
  user: PartialUserInput;

  @Field()
  journey: PartialJourneyInput;
}

@InputType()
export class UpdateBookingInput {
  @Field(() => ID)
  id: string;

  @Field()
  status: Status;
}
