import { SQLDatabase } from 'encore.dev/storage/sqldb';

export const studioDB = new SQLDatabase("studio", {
  migrations: "./migrations",
});
