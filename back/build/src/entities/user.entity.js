"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWithoutPassord = exports.UserMessage = exports.LoginInput = exports.UpdateUserInput = exports.CreateUserInput = exports.UserEntity = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const journey_entity_1 = require("./journey.entity");
const booking_entity_1 = require("./booking.entity");
const graphql_scalars_1 = require("graphql-scalars");
const argon2_1 = __importDefault(require("argon2"));
const class_validator_1 = require("class-validator");
let UserEntity = class UserEntity {
    async beforeInsert() {
        this.password = await argon2_1.default.hash(this.password);
    }
    id;
    firstname;
    lastname;
    email;
    password;
    dateOfBirth;
    //TODO formatage phone number
    // @Field(() => GraphQLPhoneNumber, { nullable: true })
    // @IsMobilePhone(undefined, undefined, {
    //     message: 'Please provide a valid phone number',
    // })
    phoneNumber;
    profilPicture;
    role;
    grade;
    tripsAsPassenger;
    tripsAsDriver;
    status;
    createdAt;
    updatedAt;
    // @Field(() => [AddressEntity])
    // @OneToMany(() => AddressEntity, (a) => a.user)
    // addresses: AddressEntity[];
    journeys;
    // @Field(() => [RatingEntity])
    // @OneToMany(() => RatingEntity, (r) => r.booking)
    // ratings: RatingEntity[];
    bookings;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserEntity.prototype, "beforeInsert", null);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    (0, class_validator_1.IsString)({ message: 'Firstname must be a string' }),
    (0, class_validator_1.Length)(2, 50, { message: 'Firstname must be between 2 and 50 characters' }),
    __metadata("design:type", String)
], UserEntity.prototype, "firstname", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    (0, class_validator_1.IsString)({ message: 'Lastname must be a string' }),
    (0, class_validator_1.Length)(2, 50, { message: 'Lastname must be between 2 and 50 characters' }),
    __metadata("design:type", String)
], UserEntity.prototype, "lastname", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_scalars_1.GraphQLEmailAddress),
    (0, typeorm_1.Column)({
        length: 50,
        unique: true,
        //transformer permet de formater la donnée à la volée (ici on passe tout en lowercase)
        transformer: {
            from(value) {
                return value.toLowerCase();
            },
            to(value) {
                return value.toLowerCase();
            },
        },
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be a valid email address' }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.Length)(0, 500),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.GraphQLISODateTime),
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    (0, class_validator_1.IsDate)({ message: 'Date of birth must be a valid date' }),
    __metadata("design:type", Date
    //TODO formatage phone number
    // @Field(() => GraphQLPhoneNumber, { nullable: true })
    )
], UserEntity.prototype, "dateOfBirth", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)()
    // @IsMobilePhone(undefined, undefined, {
    //     message: 'Please provide a valid phone number',
    // })
    ,
    __metadata("design:type", String)
], UserEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "profilPicture", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
        type: 'text',
        enum: ['ADMIN', 'USER'],
        default: 'USER',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({
        type: 'text',
        enum: ['BEGINNER', 'CONFIRMED', 'AMBASSADOR'],
        default: 'BEGINNER',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "grade", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'trips as passenger must be an integer' }),
    __metadata("design:type", Number)
], UserEntity.prototype, "tripsAsPassenger", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'trips as driver must be an integer' }),
    __metadata("design:type", Number)
], UserEntity.prototype, "tripsAsDriver", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({
        type: 'text',
        enum: ['ACTIVE', 'ARCHIVED'],
        default: 'ACTIVE',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.GraphQLISODateTime),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.GraphQLISODateTime, { nullable: true }),
    (0, typeorm_1.UpdateDateColumn)({ nullable: true }),
    __metadata("design:type", Date
    // @Field(() => [AddressEntity])
    // @OneToMany(() => AddressEntity, (a) => a.user)
    // addresses: AddressEntity[];
    )
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [journey_entity_1.JourneyEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => journey_entity_1.JourneyEntity, (j) => j.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "journeys", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [booking_entity_1.BookingEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => booking_entity_1.BookingEntity, (b) => b.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "bookings", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], UserEntity);
// -------------- INPUTS -------------- //
let CreateUserInput = class CreateUserInput {
    firstname;
    lastname;
    email;
    password;
    dateOfBirth;
    phoneNumber;
    profilePicture;
    role;
};
exports.CreateUserInput = CreateUserInput;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "firstname", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "lastname", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.GraphQLISODateTime),
    __metadata("design:type", Date)
], CreateUserInput.prototype, "dateOfBirth", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateUserInput.prototype, "phoneNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateUserInput.prototype, "profilePicture", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateUserInput.prototype, "role", void 0);
exports.CreateUserInput = CreateUserInput = __decorate([
    (0, type_graphql_1.InputType)()
], CreateUserInput);
let UpdateUserInput = class UpdateUserInput {
    id;
    firstname;
    lastname;
    email;
    password;
    dateOfBirth;
    phoneNumber;
    profilePicture;
    role;
    grade;
    status;
    tripsAsPassenger;
    tripsAsDriver;
};
exports.UpdateUserInput = UpdateUserInput;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "firstname", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "lastname", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_scalars_1.GraphQLEmailAddress, { nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Date)
], UpdateUserInput.prototype, "dateOfBirth", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_scalars_1.GraphQLPhoneNumber, { nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "phoneNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "profilePicture", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "role", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "grade", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], UpdateUserInput.prototype, "tripsAsPassenger", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], UpdateUserInput.prototype, "tripsAsDriver", void 0);
exports.UpdateUserInput = UpdateUserInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateUserInput);
let LoginInput = class LoginInput {
    email;
    password;
};
exports.LoginInput = LoginInput;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
exports.LoginInput = LoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], LoginInput);
let UserMessage = class UserMessage {
    success;
    message;
    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
};
exports.UserMessage = UserMessage;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UserMessage.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserMessage.prototype, "message", void 0);
exports.UserMessage = UserMessage = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Boolean, String])
], UserMessage);
let UserWithoutPassord = class UserWithoutPassord {
    firstname;
    lastname;
    email;
};
exports.UserWithoutPassord = UserWithoutPassord;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserWithoutPassord.prototype, "firstname", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserWithoutPassord.prototype, "lastname", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_scalars_1.GraphQLEmailAddress),
    __metadata("design:type", String)
], UserWithoutPassord.prototype, "email", void 0);
exports.UserWithoutPassord = UserWithoutPassord = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserWithoutPassord);
