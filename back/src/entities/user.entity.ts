import { EmailAddress, PhoneNumber } from "graphql-scalars/typings/mocks";
import { Field, GraphQLISODateTime, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type Role = "USER" | "ADMIN";
export type Grade = "BEGINNER" | "CONFIRMED" | "AMBASSADOR";
export type Status = "ARCHIVED" | "ACTIVE";

@ObjectType()
@Entity()
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ length: 50 })
  firstname: string;

  @Field()
  @Column({ length: 50 })
  lastname: string;

  @Field(() => EmailAddress)
  @Column({ length: 50 })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field(() => GraphQLISODateTime)
  @Column({ type: "timestamptz" })
  dateOfBirth: Date;

  @Field(() => PhoneNumber)
  @Column()
  phoneNumber: string;

  @Field()
  @Column()
  profilPicture: string;

  @Field()
  @Column({
    type: "text",
    enum: ["ADMIN", "USER"],
    default: "USER",
  })
  role: Role;

  @Field()
  @Column({
    type: "text",
    enum: ["BEGINNER", "CONFIRMED", "AMBASSADOR"],
    default: "BEGINNER",
  })
  grade: Grade;

  @Field()
  @Column({ default: 0 })
  tripsAsPassenger: number;

  @Field()
  @Column({ default: 0 })
  tripsAsDriver: number;

  @Field()
  @Column({
    type: "text",
    enum: ["ACTIVE", "ARCHIVED"],
    default: "ACTIVE",
  })
  status: Status;

  @Field()
  @Column()
  createdAt: Date;
}
