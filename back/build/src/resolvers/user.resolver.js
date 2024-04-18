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
const user_entity_1 = require("../entities/user.entity");
const users_service_1 = __importDefault(require("../services/users.service"));
const argon2_1 = __importDefault(require("argon2"));
const jose_1 = require("jose");
const cookies_1 = __importDefault(require("cookies"));
const userAuthorized_1 = require("../utils/userAuthorized");
let UserResolver = class UserResolver {
    async listUsers() {
        return await new users_service_1.default().listUser();
    }
    async findUserById(id) {
        return await new users_service_1.default().findUserById(id);
    }
    // @Authorized()
    // @Query(() => UserEntity)
    // async findUserByEmail(@Arg('email') email: string) {
    //     return await new UsersService().findUserById(email)
    // }
    async login({ email, password }, { req, res }) {
        const userService = new users_service_1.default();
        const user = await userService.findUserByEmailWitoutAsserting(email);
        if (!user)
            throw new Error('Vérifiez vos informations');
        const isPasswordValid = await argon2_1.default.verify(user.password, password);
        if (isPasswordValid) {
            const token = await new jose_1.SignJWT({
                email,
                role: user.role,
                id: user.id,
            })
                // alg = algorithme à utiliser pour hasher la signature
                // typ = le type de token qui est généré
                .setProtectedHeader({
                alg: 'HS256',
                typ: 'jwt',
            })
                // Durée de validité du token
                .setExpirationTime('2 h')
                // La méthode encode() de la classe TextEncoder permet d'obtenir un flux d'octets encodés en utf-8 à partir d'une chaine de caractère
                // car sign() attend en premier argument un Uint8Array et non une string, d'ou l'utilisation de TextEncoder
                .sign(new TextEncoder().encode(`${process.env.SECRET_KEY}`));
            // On crée une instance de la classe Cookies en lui passant la req et la res du context crée dans l'expressMiddleware (index.ts)
            const cookies = new cookies_1.default(req, res);
            // On set un nouveau cookie nommé 'token' contenant le token créé
            // httpOnly s'assure que le cookie n'est pas modifiable depuis le client (readonly)
            // Evite les attaques cross site scripting (XSS)
            cookies.set('token', token, { httpOnly: true });
            return user;
        }
        throw new Error('Vérifiez vos informations');
    }
    async register(data) {
        return await new users_service_1.default().create(data);
    }
    async logout({ req, res, user }) {
        if (user) {
            const cookies = new cookies_1.default(req, res);
            cookies.set('token'); // sans valeur, le cookie token sera supprimé
        }
        return new user_entity_1.UserMessage(true, 'Vous avez été déconnecté');
    }
    async updateUser(data, { user }) {
        (0, userAuthorized_1.userAuthorized)([data.id], user);
        return await new users_service_1.default().updateUser(data);
    }
    async archiveUser(id, { user }) {
        (0, userAuthorized_1.userAuthorized)([id], user);
        return await new users_service_1.default().updateUser({ id, status: 'ARCHIVED' });
    }
};
__decorate([
    (0, type_graphql_1.Authorized)(['ADMIN']),
    (0, type_graphql_1.Query)(() => [user_entity_1.UserEntity]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "listUsers", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_entity_1.UserEntity),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "findUserById", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_entity_1.UserEntity),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_entity_1.UserWithoutPassord),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_entity_1.UserMessage),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => user_entity_1.UserEntity),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UpdateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => user_entity_1.UserEntity),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "archiveUser", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => user_entity_1.UserEntity)
], UserResolver);
exports.default = UserResolver;
