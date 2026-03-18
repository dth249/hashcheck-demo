import postgres from 'postgres';

const conn = postgres(process.env.DATABASE_URL!, {
    ssl: 'require',
});

export default conn;