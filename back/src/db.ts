import { DataSource } from 'typeorm'

console.log('PROCESS', process.env.NODE_ENV)
export default new DataSource({
    type: 'postgres',
    host: process.env.NODE_ENV === 'test' ? 'db_test' : 'db',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true, //en dev, en prod on préfera utiliser les migrations
    // logging: ['query', 'error'],
    entities: [__dirname + '/entities/*.{js,ts}'],
})
