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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookingInput = exports.CreateBookingInput = exports.PartialBookingInput = exports.BookingEntity = void 0;
const typeorm_1 = require("typeorm"); // Pour définir les entités TypeORM
const type_graphql_1 = require("type-graphql"); // Pour définir les Types GraphQL
const class_validator_1 = require("class-validator"); // to add validators
const user_entity_1 = require("./user.entity");
const journey_entity_1 = require("./journey.entity");
let BookingEntity = class BookingEntity {
    id;
    totalPrice;
    departureTime;
    arrivalTime;
    status; // Type créé pour le Statut
    // @Field(() => [StepEntity])
    // @JoinTable()
    // @ManyToMany(() => StepEntity, (s) => s.bookings)
    // steps: StepEntity[];
    user;
    journey;
    // @Field(() => [RatingEntity])
    // @OneToMany(() => RatingEntity, (rating) => rating.booking)
    // ratings: RatingEntity[];
    createdAt;
    updatedAt;
};
exports.BookingEntity = BookingEntity;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID) // pour GraphQL
    ,
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid') // pour TypeORM
    ,
    __metadata("design:type", String)
], BookingEntity.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'float' }),
    (0, class_validator_1.Min)(0.1, { message: 'Price must be greater than 0' }),
    __metadata("design:type", Number)
], BookingEntity.prototype, "totalPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'timestamptz' }) // Recommended for Date  typeORM
    ,
    (0, class_validator_1.IsDate)({ message: 'Departure time must be a valide date' }),
    __metadata("design:type", Date)
], BookingEntity.prototype, "departureTime", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'timestamptz' }) // Recommended for Date  typeORM
    ,
    (0, class_validator_1.IsDate)({ message: 'Arrival time must be a valide date' }),
    __metadata("design:type", Date)
], BookingEntity.prototype, "arrivalTime", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
        type: 'text',
        enum: ['PENDING', 'REJECTED', 'ACCEPTED', 'CANCELLED'],
        default: ['PENDING'],
    }),
    __metadata("design:type", String)
], BookingEntity.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_entity_1.UserEntity),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (u) => u.bookings),
    __metadata("design:type", user_entity_1.UserEntity)
], BookingEntity.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => journey_entity_1.JourneyEntity),
    (0, typeorm_1.ManyToOne)(() => journey_entity_1.JourneyEntity, (j) => j.bookings),
    __metadata("design:type", journey_entity_1.JourneyEntity
    // @Field(() => [RatingEntity])
    // @OneToMany(() => RatingEntity, (rating) => rating.booking)
    // ratings: RatingEntity[];
    )
], BookingEntity.prototype, "journey", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.GraphQLISODateTime),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BookingEntity.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.GraphQLISODateTime, { nullable: true }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BookingEntity.prototype, "updatedAt", void 0);
exports.BookingEntity = BookingEntity = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], BookingEntity);
// --------- INPUTS ------------ //
let PartialBookingInput = class PartialBookingInput {
    id;
};
exports.PartialBookingInput = PartialBookingInput;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], PartialBookingInput.prototype, "id", void 0);
exports.PartialBookingInput = PartialBookingInput = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, type_graphql_1.InputType)()
], PartialBookingInput);
let CreateBookingInput = class CreateBookingInput {
    totalPrice;
    departureTime;
    arrivalTime;
    user;
    journey;
    status;
};
exports.CreateBookingInput = CreateBookingInput;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], CreateBookingInput.prototype, "totalPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateBookingInput.prototype, "departureTime", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateBookingInput.prototype, "arrivalTime", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => PartialBookingInput),
    __metadata("design:type", PartialBookingInput)
], CreateBookingInput.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => PartialBookingInput),
    __metadata("design:type", PartialBookingInput)
], CreateBookingInput.prototype, "journey", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBookingInput.prototype, "status", void 0);
exports.CreateBookingInput = CreateBookingInput = __decorate([
    (0, type_graphql_1.InputType)()
], CreateBookingInput);
let UpdateBookingInput = class UpdateBookingInput {
    status;
};
exports.UpdateBookingInput = UpdateBookingInput;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateBookingInput.prototype, "status", void 0);
exports.UpdateBookingInput = UpdateBookingInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateBookingInput);
