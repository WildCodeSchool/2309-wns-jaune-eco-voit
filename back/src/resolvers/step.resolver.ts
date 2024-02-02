import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Field, ObjectType, ID, Float, Int, InputType } from 'type-graphql';



import { Journey } from "./journey.entity";

@ObjectType()
@Entity()
export class StepEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Float)
  @Column('float')
  price: number;

  @Field()
  @Column({ length: 50 })
  origin: string;

  @Field()
  @Column({ length: 50 })
  destination: string;

  @Field()
  @Column('timestamp')
  departure_time: Date;

  @Field()
  @Column('timestamp')
  arrival_time: Date;

  @Field(() => ID)
  @Column('uuid')
  journey_id: string;

  @Field(() => Journey)
  @ManyToOne(() => Journey, j => j.steps)
  journey: Journey;

  @Field(() => Int)
  @Column('int')
  available_seats: number;

  @CreateDateColumn()
  createdAt: string;
}

// CREATE

@InputType()
export class CreateStepInput {
  @Field(() => Float)
  price: number;

  @Field()
  origin: string;

  @Field()
  destination: string;

  @Field()
  departure_time: Date;

  @Field()
  arrival_time: Date;

  @Field(() => ID)
  journey_id: string;

  @Field(() => Int)
  available_seats: number;
}