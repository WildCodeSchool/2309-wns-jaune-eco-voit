import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

import { User } from "./user.entity";
import { Journey } from "./journey.entity";

@ObjectType()
@Entity()
export class MessageEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => User, u => u.messages)
  user: User;

  @ManyToOne(() => Journey, j => j.messages)
  journey: Journey;
}

// CREATE MESSAGE INPUT
@InputType()
export class CreateMessageInput {
  @Field()
  content: string;
}
