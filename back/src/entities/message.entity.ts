import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import {
  Field,
  InputType,
  ObjectType,
  ID,
  GraphQLISODateTime,
} from "type-graphql";
import { Length } from "class-validator";

import { UserEntity } from "./user.entity";
import { JourneyEntity } from "./journey.entity";

export type Status = "ACTIVE" | "ARCHIVED";

@ObjectType()
@Entity()
export class MessageEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ length: 500 })
  @Length(1, 500, {
    message:
      "Le message doit contenir au minimum 1 caractères et au maximum 500 caractères",
  })
  content: string;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column({
    type: "text",
    enum: ["ACTIVE", "ARCHIVED"],
    default: "ACTIVE",
  })
  status: Status;

  @ManyToOne(() => UserEntity, (u) => u.messages)
  user: UserEntity;

  @ManyToOne(() => JourneyEntity, (j) => j.messages)
  journey: JourneyEntity;
}

// INPUT PARTIALS
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

// CREATE
@InputType()
export class CreateMessageInput {
  @Field()
  @Length(1, 500, {
    message:
      "Le message doit contenir au minimum 1 caractère et au maximum 500 caractères",
  })
  content: string;

  @Field(() => ID)
  user: PartialUserInput;

  @Field(() => ID)
  journey: PartialJourneyInput;
}

// UPDATE
@InputType()
export class UpdateMessageInput {
  @Field()
  @Length(1, 500, {
    message:
      "Le message doit contenir au minimum 1 caractère et au maximum 500 caractères",
  })
  content: string;

  @Field({ nullable: true })
  status: Status;

  @Field(() => ID)
  user: PartialUserInput;

  @Field(() => ID)
  journey: PartialJourneyInput;
}
