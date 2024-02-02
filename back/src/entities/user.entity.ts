import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export type Role = "USER" | "ADMIN";
export type Grade = 'BEGINNER' | 'CONFIRMED' | 'AMBASSADOR';
export type Status = 'ARCHIVED' | 'ACTIVE';

@ObjectType()  
@Entity()
export class UserEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field()
    @Column()
    firstname: string

    @Field()
    @Column()
    lastname: string;

    @Field()
    @Column()
    email: string

    @Field()
    @Column()
    password: string
    
    @Field()
    @Column({type: 'timestamptz'})
    dateOfBirth: Date

    @Field()
    @Column()
    phoneNumber: string
    
    @Field()
    @Column()
    profilPicture: string

    @Field()
    @Column({
        type: 'text', 
        enum: ['ADMIN', 'USER'],
        default: 'USER',
    })
    role: Role

    @Field()
    @Column({
        type: 'text', 
        enum: ['BEGINNER', 'CONFIRMED', 'AMBASSADOR'],
        default: 'BEGINNER',
    })
    grade: Grade

    @Field()
    @Column()
    tripsAsPassenger: number

    @Field()
    @Column()
    tripsAsDriver: number

    @Field()
    @Column({
        type: 'text', 
        enum: ['ACTIVE', 'ARCHIVED'],
        default: 'ACTIVE',
    })
    status: Status

    @Field()
    @Column()
    createdAt: Date

}