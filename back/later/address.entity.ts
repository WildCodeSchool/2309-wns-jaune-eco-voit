import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm"; // Pour définir les entités TypeORM
import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  ObjectType,
} from "type-graphql"; // Pour définir les Types GraphQL

import { CountryCode, PostalCode } from "graphql-scalars/typings/mocks";
import { UserEntity } from "../src/entities/user.entity";

export type Status = "ACTIVE" | "ARCHIVED";

@ObjectType() //pour TypeGraphQL
@Entity() // pour TypeORM
export class AddressEntity {
  @Field(() => ID) // pour GraphQL
  @PrimaryGeneratedColumn("uuid") // pour TypeORM
  id: string;

  @Field()
  @Column()
  streetNumber: number;

  @Field()
  @Column({ length: 250 })
  streetName: string;

  @Field(() => PostalCode)
  @Column({ length: 5 })
  postalCode: string;

  @Field()
  @Column({ length: 100 })
  city: string;

  @Field(() => CountryCode)
  @Column({ length: 100 })
  country: string;

  //To add an ENUM to a field use options in @Column()
  @Field()
  @Column({
    type: "text",
    enum: ["ACTIVE", "ARCHIVED"],
    default: "ACTIVE",
  })
  status: Status; // Type créé pour le Statut

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.addresses)
  user: UserEntity;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;
}

// --------- INPUTS ------------ //

@InputType()
export class PartialUserInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class CreateAddressInput {
  @Field()
  streetNumber: number;

  @Field()
  streetName: string;

  @Field()
  postalCode: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field()
  user: PartialUserInput;
}

@InputType()
export class UpdateAddresseInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  streetNumber: number;

  @Field({ nullable: true })
  streetName: string;

  @Field({ nullable: true })
  postalCode: string;

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  status: Status;
}
