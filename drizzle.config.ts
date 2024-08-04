import { defineConfig } from 'drizzle-kit';

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE
} = process.env;

if (!POSTGRES_HOST || !POSTGRES_DATABASE) {
  throw new Error('POSTGRES_HOST and POSTGRES_DATABASE environment variables must be defined.');
}

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
  },
});
