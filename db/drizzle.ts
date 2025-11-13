import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

config({ path: ".env" }); // or .env.local

// Bypass database connection if URL is not valid
const databaseUrl = process.env.DATABASE_URL;
const isValidUrl = databaseUrl && 
  databaseUrl !== 'your-neon-database-url' && 
  (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'));

let db: ReturnType<typeof drizzle>;

if (isValidUrl) {
  try {
    const sql = neon(databaseUrl!);
    db = drizzle(sql);
  } catch (error) {
    console.warn('Database connection failed, using mock. Error:', error);
    // Create a mock db object with minimal structure
    db = {} as ReturnType<typeof drizzle>;
  }
} else {
  console.warn('DATABASE_URL not configured, using mock database. Please configure DATABASE_URL in .env.local');
  // Create a mock db object
  db = {} as ReturnType<typeof drizzle>;
}

export { db };
export const isDatabaseConfigured = isValidUrl || false;
