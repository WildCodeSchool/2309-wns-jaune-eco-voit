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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const journeys_service_1 = __importDefault(require("../services/journeys.service"));
const journey_entity_1 = require("../entities/journey.entity");
const users_service_1 = __importDefault(require("../services/users.service"));
const userAuthorized_1 = require("../utils/userAuthorized");
const bookings_service_1 = __importDefault(require("../services/bookings.service"));
let JourneyResolver = class JourneyResolver {
    async listJourneys() {
        return await new journeys_service_1.default().listJourneys();
    }
    async findJourneyById(id) {
        return await new journeys_service_1.default().findJourneyById(id);
    }
    async listJourneysByUser(userId, { user }) {
        // On vérifie l'id envoyé en argument correspond bien à un user existant
        // Si ce n'est pas le cas, une erreur sera envoyé directement depuis la méthode findUserById du userService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que le user existe
        await new users_service_1.default().findUserById(userId);
        (0, userAuthorized_1.userAuthorized)([userId], user);
        console.log('COUCOU');
        return await new journeys_service_1.default().listJourneysFilter({
            userId,
        });
    }
    async createJourney(data, { user }) {
        (0, userAuthorized_1.userAuthorized)([data.user.id], user);
        return await new journeys_service_1.default().createJourney(data);
    }
    async updateJourney(data, { user }) {
        const journeyService = new journeys_service_1.default();
        const { user: journeyUser } = await journeyService.findJourneyById(data.id);
        (0, userAuthorized_1.userAuthorized)([journeyUser.id], user);
        return await journeyService.updateJourney(data);
    }
    async decreaseAvailableSeats(id, { user }) {
        const { availableSeats, user: journeyUser } = await new journeys_service_1.default().findJourneyById(id);
        if (availableSeats <= 0) {
            throw Error("There's no more available seats for this journey");
        }
        (0, userAuthorized_1.userAuthorized)([journeyUser.id], user);
        return await new journeys_service_1.default().updateJourney({
            id,
            availableSeats: availableSeats - 1,
        });
    }
    async increaseAvailableSeats(id, { user }) {
        const { availableSeats, bookings, user: journeyUser, } = await new journeys_service_1.default().findJourneyById(id);
        (0, userAuthorized_1.userAuthorized)([journeyUser.id], user);
        if (availableSeats >= 4 ||
            (bookings &&
                bookings.filter((booking) => booking.status === 'ACCEPTED')
                    ?.length >= 4)) {
            throw new Error('Impossible to add a seat');
        }
        return await new journeys_service_1.default().updateJourney({
            id,
            availableSeats: availableSeats + 1,
        });
    }
    async updateJourneyStatus(data, { user }) {
        const journeyService = new journeys_service_1.default();
        const bookingService = new bookings_service_1.default();
        const { user: journeyUser, status } = await journeyService.findJourneyById(data.id);
        const bookings = await bookingService.listBookingsByJourneyId(data.id);
        (0, userAuthorized_1.userAuthorized)([journeyUser.id], user);
        if (status === 'CANCELLED')
            throw new Error('This journey had been cancelled');
        if (status === 'DONE')
            throw new Error('This journey is done');
        if (data.status === status)
            throw new Error('Journey already has this status');
        if (data.status === 'CANCELLED') {
            bookings
                ?.filter((booking) => booking.status !== 'CANCELLED')
                .forEach(async (booking) => {
                return await bookingService.updateBooking(booking.id, {
                    status: 'CANCELLED',
                });
            });
        }
        const usersService = new users_service_1.default();
        if (data.status === 'DONE') {
            bookings
                ?.filter((booking) => booking.status === 'ACCEPTED')
                .reduce((usersId, booking) => {
                return [...usersId, booking.user.id];
            }, [])
                .forEach(async (userId) => {
                const { tripsAsPassenger } = await usersService.findUserById(userId);
                usersService.updateUser({
                    id: userId,
                    tripsAsPassenger: tripsAsPassenger + 1,
                });
            });
        }
        const { tripsAsDriver } = await usersService.findUserById(journeyUser.id);
        usersService.updateUser({
            id: journeyUser.id,
            tripsAsDriver: tripsAsDriver + 1,
        });
        return await new journeys_service_1.default().updateJourney(data);
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [journey_entity_1.JourneyEntity]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JourneyResolver.prototype, "listJourneys", null);
__decorate([
    (0, type_graphql_1.Query)(() => journey_entity_1.JourneyEntity),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JourneyResolver.prototype, "findJourneyById", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => [journey_entity_1.JourneyEntity]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JourneyResolver.prototype, "listJourneysByUser", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => journey_entity_1.JourneyEntity),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [journey_entity_1.CreateJourneyInput, Object]),
    __metadata("design:returntype", Promise)
], JourneyResolver.prototype, "createJourney", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => journey_entity_1.JourneyEntity),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [journey_entity_1.UpdateJourneyInput, Object]),
    __metadata("design:returntype", Promise)
], JourneyResolver.prototype, "updateJourney", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => journey_entity_1.JourneyEntity),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JourneyResolver.prototype, "decreaseAvailableSeats", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => journey_entity_1.JourneyEntity),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JourneyResolver.prototype, "increaseAvailableSeats", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => journey_entity_1.JourneyEntity),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [journey_entity_1.UpdateJourneyStatusInput, Object]),
    __metadata("design:returntype", Promise)
], JourneyResolver.prototype, "updateJourneyStatus", null);
JourneyResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], JourneyResolver);
exports.default = JourneyResolver;
