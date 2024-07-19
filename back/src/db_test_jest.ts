import { DataSource } from 'typeorm'

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'ecovoit_user',
    password: 'ecovoit_password',
    database: 'ecovoit',
    synchronize: true, // en dev, en prod on préfera utiliser les migrations
    // logging: ['query', 'error'],
    entities: ['src/entities/*.ts'],
})
