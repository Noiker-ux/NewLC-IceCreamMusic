import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { Pool } from "pg";

const connectionPool = new Pool({
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/icecream`,
});

export const db: NodePgDatabase<typeof schema> = drizzle(connectionPool);
