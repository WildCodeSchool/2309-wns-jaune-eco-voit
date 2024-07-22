import { DataSource } from 'typeorm'

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_TEST_JEST_HOST ?? 'localhost',
    port: process.env.DB_TEST_JEST_PORT
        ? parseInt(process.env.DB_TEST_JEST_PORT)
        : 5435,
    username: 'ecovoit_user',
    password: 'ecovoit_password',
    database: 'ecovoit',
    synchronize: true, // en dev, en prod on préfera utiliser les migrations
    // logging: ['query', 'error'],
    entities: ['src/entities/*.ts'],
})
