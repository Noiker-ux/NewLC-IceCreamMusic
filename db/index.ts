import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// const queryClient = postgres(
//   `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/icecream`
// );

const connectionPoool = new Pool({
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/icecream`,
});

export const db = drizzle(connectionPoool);
