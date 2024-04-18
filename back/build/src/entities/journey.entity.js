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
exports.UpdateJourneyStatusInput = exports.UpdateJourneyInput = exports.CreateJourneyInput = exports.PartialUserInput = exports.JourneyEntity = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
// import { VehiculeEntity } from "../../later/vehicule.entity";
const user_entity_1 = require("./user.entity");
// import { MessageEntity } from "../../later/message.entity";
// import { StepEntity } from "../../later/step.entity";
const booking_entity_1 = require("./booking.entity");
const class_validator_1 = require("class-validator");
const type_graphql_2 = require("type-graphql");
let JourneyEntity = class JourneyEntity {
    id;
    user;
    // @Field(() => VehiculeEntity)
    // @ManyToOne(() => VehiculeEntity, (v) => v.journeys)
    // vehicule: VehiculeEntity;
    // @Field(() => [MessageEntity])
    // @OneToMany(() => MessageEntity, (m) => m.journey)
    // messages: MessageEntity[];
    // @Field(() => [StepEntity])
    // @OneToMany(() => StepEntity, (s) => s.journey)
    // steps: StepEntity[];
    origin;
    destination;
    totalPrice;
    departure_time;
    arrival_time;
    availableSeats;
    bookings;
    status;
    automaticAccept;
    createdAt;
    updatedAt;
};
exports.JourneyEntity = JourneyEntity;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], JourneyEntity.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_entity_1.UserEntity),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.journeys),
    __metadata("design:type", user_entity_1.UserEntity
    // @Field(() => VehiculeEntity)
    // @ManyToOne(() => VehiculeEntity, (v) => v.journeys)
    // vehicule: VehiculeEntity;
    // @Field(() => [MessageEntity])
    // @OneToMany(() => MessageEntity, (m) => m.journey)
    // messages: MessageEntity[];
    // @Field(() => [StepEntity])
    // @OneToMany(() => StepEntity, (s) => s.journey)
    // steps: StepEntity[];
    )
], JourneyEntity.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    (0, class_validator_1.Length)(3, 50, {
        message: 'Origin place must be between 3 and 50 characters.',
    }),
    __metadata("design:type", String)
], JourneyEntity.prototype, "origin", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    (0, class_validator_1.Length)(3, 50, {
        message: 'Destination place must be between 3 and 50 characters.',
    }),
    __metadata("design:type", String)
], JourneyEntity.prototype, "destination", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_2.Float),
    (0, typeorm_1.Column)({ type: 'float' }),
    (0, class_validator_1.Min)(0.1, { message: 'Total price must be greater than zero.' }),
    __metadata("design:type", Number)
], JourneyEntity.prototype, "totalPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('timestamp'),
    (0, class_validator_1.IsDate)({ message: 'Departure time must be a valide date' }),
    __metadata("design:type", Date)
], JourneyEntity.prototype, "departure_time", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('timestamp'),
    (0, class_validator_1.IsDate)({ message: 'Arrival time must be a valide date' }),
    __metadata("design:type", Date)
], JourneyEntity.prototype, "arrival_time", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsInt)({ message: 'Avalaible seats must e a number' })
    // Min to 0 cause when the journey will be full, the number of available seats will be 0
    ,
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(4, { message: 'Max available seats is 4' }),
    __metadata("design:type", Number)
], JourneyEntity.prototype, "availableSeats", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [booking_entity_1.BookingEntity]),
    (0, typeorm_1.OneToMany)(() => booking_entity_1.BookingEntity, (b) => b.journey),
    __metadata("design:type", Array)
], JourneyEntity.prototype, "bookings", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
        type: 'text',
        enum: ['PLANNED', 'CANCELLED', 'DONE'],
        default: ['PLANNED'],
    }),
    __metadata("design:type", String)
], JourneyEntity.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsBoolean)({ message: 'AutomaticAccept must be a boolean' }),
    __metadata("design:type", Boolean)
], JourneyEntity.prototype, "automaticAccept", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.GraphQLISODateTime),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JourneyEntity.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.GraphQLISODateTime, { nullable: true }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], JourneyEntity.prototype, "updatedAt", void 0);
exports.JourneyEntity = JourneyEntity = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], JourneyEntity);
/**============================================
 *?               Inputs
 *=============================================**/
// Ne pas oublier d'enlever les commentaires
// @InputType()
// export class PartialVehiculeInput {
//   @Field(() => ID)
//   id: string;
// }
let PartialUserInput = class PartialUserInput {
    id;
};
exports.PartialUserInput = PartialUserInput;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], PartialUserInput.prototype, "id", void 0);
exports.PartialUserInput = PartialUserInput = __decorate([
    (0, type_graphql_1.InputType)()
], PartialUserInput);
let CreateJourneyInput = class CreateJourneyInput {
    // @Field()
    // vehicule: PartialVehiculeInput;
    departure_time;
    arrival_time;
    origin;
    destination;
    totalPrice;
    automaticAccept;
    user;
    availableSeats;
};
exports.CreateJourneyInput = CreateJourneyInput;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateJourneyInput.prototype, "departure_time", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateJourneyInput.prototype, "arrival_time", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateJourneyInput.prototype, "origin", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateJourneyInput.prototype, "destination", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_2.Float),
    __metadata("design:type", Number)
], CreateJourneyInput.prototype, "totalPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CreateJourneyInput.prototype, "automaticAccept", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => PartialUserInput),
    __metadata("design:type", PartialUserInput)
], CreateJourneyInput.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CreateJourneyInput.prototype, "availableSeats", void 0);
exports.CreateJourneyInput = CreateJourneyInput = __decorate([
    (0, type_graphql_1.InputType)()
], CreateJourneyInput);
let UpdateJourneyInput = class UpdateJourneyInput {
    id;
    departure_time;
    arrival_time;
    origin;
    destination;
    totalPrice;
    automaticAccept;
    status;
    availableSeats;
};
exports.UpdateJourneyInput = UpdateJourneyInput;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], UpdateJourneyInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], UpdateJourneyInput.prototype, "departure_time", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], UpdateJourneyInput.prototype, "arrival_time", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateJourneyInput.prototype, "origin", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateJourneyInput.prototype, "destination", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_2.Float, { nullable: true }),
    __metadata("design:type", Number)
], UpdateJourneyInput.prototype, "totalPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UpdateJourneyInput.prototype, "automaticAccept", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateJourneyInput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], UpdateJourneyInput.prototype, "availableSeats", void 0);
exports.UpdateJourneyInput = UpdateJourneyInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateJourneyInput);
let UpdateJourneyStatusInput = class UpdateJourneyStatusInput {
    id;
    status;
};
exports.UpdateJourneyStatusInput = UpdateJourneyStatusInput;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], UpdateJourneyStatusInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateJourneyStatusInput.prototype, "status", void 0);
exports.UpdateJourneyStatusInput = UpdateJourneyStatusInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateJourneyStatusInput);
