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
const bookings_service_1 = __importDefault(require("../services/bookings.service"));
const booking_entity_1 = require("../entities/booking.entity");
const users_service_1 = __importDefault(require("../services/users.service"));
const journeys_service_1 = __importDefault(require("../services/journeys.service"));
const userAuthorized_1 = require("../utils/userAuthorized");
let BookingResolver = class BookingResolver {
    async listBookings() {
        return await new bookings_service_1.default().listBookings();
    }
    async findBookingById(id, { user }) {
        const booking = await new bookings_service_1.default().findBookingById(id);
        (0, userAuthorized_1.userAuthorized)([booking.user.id, booking.journey.user.id], user);
        return booking;
    }
    async listBookingsByUser(userId, { user }) {
        // On vérifie l'id envoyé en argument correspond bien à un user existant dans la DB
        // Si ce n'est pas le cas, une erreur sera envoyé directement depuis la méthode findUserById du userService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que le user existe
        await new users_service_1.default().findUserById(userId);
        // On vérifie que l'id du user envoyé par le context correspond à l'id envoyé en arg
        (0, userAuthorized_1.userAuthorized)([userId], user);
        return await new bookings_service_1.default().listBookingsFilter({
            userId,
        });
    }
    async listBookingsByJourney(journeyId, { user }) {
        // On vérifie que la journeyId envoyé existe
        // Si ce n'est pas le cas, l'erreur sera envoyé directement depuis la fonciton findJourneyById du JourneysService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que la journey existe
        const { status: journeyStatus, user: journeyUser } = await new journeys_service_1.default().findJourneyById(journeyId);
        const bookings = await new bookings_service_1.default().listBookingsFilter({
            journeyId,
        });
        if (user?.role === 'ADMIN' || journeyUser.id === user?.id) {
            return bookings;
        }
        else {
            if (journeyStatus === 'PLANNED') {
                return bookings.filter((booking) => booking.status === 'ACCEPTED');
            }
            else {
                throw new Error('Access denied');
            }
        }
    }
    async createBooking(data, { user }) {
        (0, userAuthorized_1.userAuthorized)([data.user.id], user);
        const journeyService = new journeys_service_1.default();
        const { availableSeats, automaticAccept } = await journeyService.findJourneyById(data.journey.id);
        if (availableSeats <= 0)
            throw new Error('No available seats for this journey');
        const newBooking = new bookings_service_1.default().createBooking({
            ...data,
            status: automaticAccept ? 'ACCEPTED' : 'PENDING',
        });
        automaticAccept &&
            (await journeyService.updateJourney({
                id: data.journey.id,
                availableSeats: availableSeats - 1,
            }));
        return newBooking;
    }
    async acceptBooking(id, { user }) {
        const bookingService = new bookings_service_1.default();
        const { journey } = await bookingService.findBookingById(id);
        const { user: journeyUser } = await new journeys_service_1.default().findJourneyById(journey.id);
        (0, userAuthorized_1.userAuthorized)([journeyUser.id], user);
        if (journey.availableSeats <= 0)
            throw new Error('No available seats for this journey');
        console.log('ok2');
        await new journeys_service_1.default().updateJourney({
            id: journey.id,
            availableSeats: journey.availableSeats - 1,
        });
        return await bookingService.updateBooking(id, {
            status: 'ACCEPTED',
        });
    }
    async rejectBooking(id, { user }) {
        const bookingService = new bookings_service_1.default();
        const { journey } = await bookingService.findBookingById(id);
        const { user: journeyUser } = await new journeys_service_1.default().findJourneyById(journey.id);
        (0, userAuthorized_1.userAuthorized)([journeyUser.id], user);
        return await bookingService.updateBooking(id, {
            status: 'REJECTED',
        });
    }
    async cancelBooking(id, { user }) {
        const bookingService = new bookings_service_1.default();
        const { journey, user: userBooking } = await bookingService.findBookingById(id);
        (0, userAuthorized_1.userAuthorized)([userBooking.id], user);
        await new journeys_service_1.default().updateJourney({
            id: journey.id,
            availableSeats: journey.availableSeats + 1,
        });
        return await new bookings_service_1.default().updateBooking(id, {
            status: 'CANCELLED',
        });
    }
};
__decorate([
    (0, type_graphql_1.Authorized)(['ADMIN']),
    (0, type_graphql_1.Query)(() => [booking_entity_1.BookingEntity]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "listBookings", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => booking_entity_1.BookingEntity),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "findBookingById", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => [booking_entity_1.BookingEntity]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "listBookingsByUser", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => [booking_entity_1.BookingEntity]),
    __param(0, (0, type_graphql_1.Arg)('journeyId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "listBookingsByJourney", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => booking_entity_1.BookingEntity),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_entity_1.CreateBookingInput, Object]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "createBooking", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => booking_entity_1.BookingEntity),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "acceptBooking", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => booking_entity_1.BookingEntity),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "rejectBooking", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => booking_entity_1.BookingEntity),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "cancelBooking", null);
BookingResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => booking_entity_1.BookingEntity)
], BookingResolver);
exports.default = BookingResolver;
