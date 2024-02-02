import { EmailAddress, PhoneNumber } from "graphql-scalars/typings/mocks";
import { Field, GraphQLISODateTime, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    createdAt: Date

    @Field(() => [AdressEntity])
    @OneToMany(() => AdressEntity, (adress) => adress.users)
    adresses: AdressesEntity


    @Field(() => JourneyEntity)   
    @OneToMany(() => JourneyEntity, (journey) => journey.users)   
    journey: JourneyEntity;    
    
    @Field(() => [RatingEntity])   
    @OneToMany(() => RatingEntity, (rating) => rating.booking)   
    ratings: RatingEntity[];

    @Field(() => BookingEntity)
    @OneToMany(() => BookingEntity, (booking) => booking.users)
    booking: BookingEntity; 

    @Field(() => VehiculeEntity)
    @OneToMany(() => VehiculeEntity, (vehicule) => vehicule.users)
    vehicule: VehiculeEntity; 

    @Field(() => MessageEntity)
    @OneToMany(() => MessageEntity, (message) => message.users)
    message: MessageEntity;

}

// -------------- INPUTS -------------- // 

@InputType()
export class CreateUserInput {
    @Field()
    firstname: string;
    @Field()
    lastname: string; 
    @Field()
    email: string; 
    @Field()
    dateOfBirth: string;
    @Field()
    phoneNumber: string;
    @Field()
    profilePicture: string; 
    @Field({nullable: true})
    role: Role;

}

@InputType()
export class UpdateUserInput {
    @Field({nullable: true})
    firstname: string;
    @Field({nullable: true})
    lastname: string; 
    @Field({nullable: true})
    email: string; 
    @Field({nullable: true})
    dateOfBirth: string;
    @Field({nullable: true})
    phoneNumber: string;
    @Field({nullable: true})
    profilePicture: string; 
    @Field({nullable: true})
    role: Role;
    @Field({nullable: true})
    grade: Grade; 
}

    