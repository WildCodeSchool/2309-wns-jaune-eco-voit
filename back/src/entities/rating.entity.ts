import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


export type Rate = "1" | "2" | "3" | "4" | "5"; 

@ObjectType()
@Entity()
export class RatingEntity{

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field()
    @Column()
    createdAt: Date; 

    @Field()
    @Column()
    rate: Rate

    @Field()
    @Column('uuid')
    userRated: string

    @Field()
    @Column('uuid')
    userRater: string

    @Field(() => BookingEntity)
    @ManyToOne(() => BookingEntity, (b) => b.RatingEntity)
    bookingId : BookingEntity

}

@InputType()
export class CreateRatingInput {
    @Field()
    rate: Rate; 

    @Field()
    userRaterId: string; 

    @Field()
    userRatedId: string; 

    @Field()
    bookingId: string
    
}