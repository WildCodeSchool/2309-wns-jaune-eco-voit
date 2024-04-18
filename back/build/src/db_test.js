"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5435,
    username: 'ecovoit_user',
    password: 'ecovoit_password',
    database: 'ecovoit',
    synchronize: true, //en dev, en prod on préfera utiliser les migrations
    // logging: ['query', 'error'],
    entities: ['src/entities/*.ts'],
});
