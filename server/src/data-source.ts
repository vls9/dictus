import "dotenv-safe/config.js";
import { DataSource } from "typeorm";
import { Meaning } from "./entities/Meaning.js";
import { Entry } from "./entities/Entry.js";
import { Pronunciation } from "./entities/Pronunciation.js";
import { User } from "./entities/User.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  url: process.env.DATABASE_URL as string, // Replaces username, password, database
  synchronize: true, // Set to false in prod
  logging: true,
  entities: [Meaning, Entry, Pronunciation, User],
  subscribers: [],
  migrations: ["./migrations/*.js"],
});
