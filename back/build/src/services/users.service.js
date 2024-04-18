"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const user_entity_1 = require("../entities/user.entity");
const errorHandlers_1 = require("../utils/errorHandlers");
class UsersService {
    db;
    constructor() {
        this.db = db_1.default.getRepository(user_entity_1.UserEntity);
    }
    async listUser() {
        return await this.db.find({
            relations: { journeys: true, bookings: true },
        });
    }
    async findUserById(id) {
        const user = await this.db.findOne({
            where: { id },
            relations: { journeys: true, bookings: true },
        });
        (0, errorHandlers_1.assertDataExists)(user);
        return user;
    }
    async findUserByEmail(email) {
        const user = await this.db.findOne({
            where: { email },
            relations: { journeys: true, bookings: true },
        });
        (0, errorHandlers_1.assertDataExists)(user);
        return user;
    }
    // Fonction créée parce qu'on a besoin d'un findUserByEmail qui ne renvoie pas d'erreur si le user n'existe pas, pour:
    // L'appel de la fonction dans le middleware express dans index.ts utilisé pour le JWT
    // La création d'une nouveau user, on doit vérifier justement qu'il n'existe pas donc il ne faut pas renvoyer d'erreur si c'est le cas
    async findUserByEmailWitoutAsserting(email) {
        return (await this.db.findOne({
            where: { email },
        }));
    }
    async create(body) {
        const usersService = new UsersService();
        const userExists = await usersService.findUserByEmailWitoutAsserting(body.email);
        if (userExists)
            throw new Error('Cet email est déjà utilisé');
        const newUser = this.db.create(body);
        await (0, errorHandlers_1.validateData)(newUser);
        return await this.db.save(newUser);
    }
    async updateUser({ id, ...body }) {
        const userToUpdate = await this.findUserById(id);
        const userUpdated = this.db.merge(userToUpdate, body);
        await (0, errorHandlers_1.validateData)(userUpdated);
        return this.db.save(userUpdated);
    }
}
exports.default = UsersService;
