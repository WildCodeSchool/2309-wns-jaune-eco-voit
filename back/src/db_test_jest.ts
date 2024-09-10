import { DataSource } from 'typeorm'

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: process.env.DB_TEST_JEST_PORT
        ? parseInt(process.env.DB_TEST_JEST_PORT)
        : 5435,
    username: 'ecovoit_user',
    password: 'ecovoit_password',
    database: 'ecovoit',
    synchronize: true,
    entities: ['src/entities/*.ts'],
})
