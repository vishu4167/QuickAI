import { neon, NeonQueryFunction } from '@neondatabase/serverless';


const databaseUrl: string = process.env.DATABASE_URL!;

const sql: NeonQueryFunction<false, false> = neon(databaseUrl);

export default sql;

