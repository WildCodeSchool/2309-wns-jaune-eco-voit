"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const booking_entity_1 = require("../entities/booking.entity");
const errorHandlers_1 = require("../utils/errorHandlers");
class BookingsService {
    db;
    constructor() {
        this.db = db_1.default.getRepository(booking_entity_1.BookingEntity);
    }
    async listBookings() {
        return await this.db.find({
            relations: { user: true, journey: true },
        });
    }
    async findBookingById(id) {
        const book = await this.db.findOne({
            where: { id },
            relations: { user: true, journey: true },
        });
        (0, errorHandlers_1.assertDataExists)(book);
        return book;
    }
    async listBookingsByJourneyId(id) {
        return await this.db.find({
            where: { journey: { id } },
            relations: { user: true, journey: true },
        });
    }
    async listBookingsFilter({ journeyId, userId, }) {
        return await this.db.find({
            where: {
                user: { id: userId ?? undefined },
                journey: { id: journeyId ?? undefined },
            },
            relations: { user: true, journey: true },
        });
    }
    async createBooking(body) {
        const newBooking = this.db.create(body);
        await (0, errorHandlers_1.validateData)(newBooking);
        const bookingSaved = await this.db.save(newBooking);
        return this.findBookingById(bookingSaved.id);
    }
    async updateBooking(id, body) {
        const bookingToUpdate = await this.findBookingById(id);
        const bookingUpdated = this.db.merge(bookingToUpdate, body);
        await (0, errorHandlers_1.validateData)(bookingUpdated);
        const bookingSaved = await this.db.save(bookingUpdated);
        return await this.findBookingById(bookingSaved.id);
    }
}
exports.default = BookingsService;
