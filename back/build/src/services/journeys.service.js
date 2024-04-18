"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const journey_entity_1 = require("../entities/journey.entity");
const errorHandlers_1 = require("../utils/errorHandlers");
class JourneysService {
    db;
    constructor() {
        this.db = db_1.default.getRepository(journey_entity_1.JourneyEntity);
    }
    async findJourneyById(id) {
        const journey = await this.db.findOne({
            where: { id },
            relations: { user: true, bookings: true },
        });
        (0, errorHandlers_1.assertDataExists)(journey);
        return journey;
    }
    async listJourneys() {
        return await this.db.find({ relations: { user: true, bookings: true } });
    }
    async listJourneysFilter({ userId }) {
        return await this.db.find({
            where: {
                user: { id: userId ?? undefined },
            },
            relations: { user: true, bookings: true },
        });
    }
    async createJourney(data) {
        const newJourney = this.db.create(data);
        await (0, errorHandlers_1.validateData)(newJourney);
        const journeySaved = await this.db.save(newJourney);
        return this.findJourneyById(journeySaved.id);
    }
    async updateJourney({ id, ...body }) {
        const journeyToUpdate = await this.findJourneyById(id);
        const journeyToSave = this.db.merge(journeyToUpdate, body);
        await (0, errorHandlers_1.validateData)(journeyToSave);
        return await this.db.save(journeyToUpdate);
    }
}
exports.default = JourneysService;
