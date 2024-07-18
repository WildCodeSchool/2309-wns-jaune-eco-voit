import { DataSource } from 'typeorm'

export default new DataSource({
    type: 'postgres',
    host: process.env.NODE_ENV === 'test' ? 'localhost' : 'db', // Utilisation des noms de service Docker
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    entities: [__dirname + '/entities/*.{js,ts}'],
})
