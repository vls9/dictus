import "reflect-metadata";
import "dotenv-safe/config.js";
import express from "express";
import { AppDataSource } from "./data-source.js";
import session from "express-session";
import connectRedis from "connect-redis";
import { Redis } from "ioredis";
import { COOKIE_NAME, __prod__ } from "./constants.js";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import { promisify } from "util";
import { pipeline, Readable } from "stream";
import { ReadOneMeaningResolver } from "./resolvers/meaning/ReadOneMeaning.js";
import { ReadManyMeaningsResolver } from "./resolvers/meaning/ReadManyMeanings.js";
import { ReadOnePronunciationResolver } from "./resolvers/pronunciation/ReadOnePronunciation.js";
import { ReadManyPronunciationsResolver } from "./resolvers/pronunciation/ReadManyPronunciations.js";
import { CreateManyMeaningsResolver } from "./resolvers/meaning/CreateManyMeanings.js";
import { CreateManyPronunciationsResolver } from "./resolvers/pronunciation/CreateManyPronunciations.js";
import { UpdateMeaningResolver } from "./resolvers/meaning/UpdateMeaning.js";
import { UpdatePronunciationResolver } from "./resolvers/pronunciation/UpdatePronunciation.js";
import { DeleteMeaningResolver } from "./resolvers/meaning/DeleteMeaning.js";
import { DeletePronunciationResolver } from "./resolvers/pronunciation/DeletePronunciations.js";
import { CreateMeaningLinkResolver } from "./resolvers/meaning/CreateMeaningLink.js";
import { ReadMeaningIdsForPaginationResolver } from "./resolvers/meaning/ReadMeaningIdsForPagination.js";
import { ReadPronunciationIdsForPaginationResolver } from "./resolvers/pronunciation/ReadPronunciationIdsForPagination.js";
import { ChangePasswordResolver } from "./resolvers/user/ChangePassword.js";
import { ForgotPasswordResolver } from "./resolvers/user/ForgotPassword.js";
import { LoginResolver } from "./resolvers/user/Login.js";
import { LogoutResolver } from "./resolvers/user/Logout.js";
import { MeResolver } from "./resolvers/user/Me.js";
import { RegisterResolver } from "./resolvers/user/Register.js";
import { DeleteMeaningLinkResolver } from "./resolvers/meaning/DeleteMeaningLink.js";
import { CreateOneMeaningResolver } from "./resolvers/meaning/CreateOneMeaning.js";
import { CreateOnePronunciationResolver } from "./resolvers/pronunciation/CreateOnePronunciation.js";

const main = async () => {
  await AppDataSource.initialize() // Connect to DB with TypeORM
    .then(() => {
      // // Work with DB. Delete all meanings
      // Entry.delete({});
    })
    .catch((error) => console.error(error));
  // await AppDataSource.runMigrations();

  // Create instance of express
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL as string);

  app.set("trust proxy", 1);
  app.use(
    cors({
      credentials: true, // Option: "include",
      origin: process.env.CORS_ORIGIN as string,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true, // Cookie cannot be accessed in front end
        sameSite: "lax", // CSRF
        secure: __prod__, // cookie only works in HTTPS
        // sameSite: "none", // CSRF
        // secure: true, // cookie only works in HTTPS
        // domain: __prod__ ? ".example.com" : undefined,
      },
      saveUninitialized: false, // do not store empty sessions
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        // Meaning resolvers
        CreateOneMeaningResolver,
        CreateManyMeaningsResolver,
        CreateMeaningLinkResolver,
        DeleteMeaningResolver,
        DeleteMeaningLinkResolver,
        ReadOneMeaningResolver,
        ReadManyMeaningsResolver,
        ReadMeaningIdsForPaginationResolver,
        UpdateMeaningResolver,
        // Pronunciation resolvers
        CreateOnePronunciationResolver,
        CreateManyPronunciationsResolver,
        DeletePronunciationResolver,
        ReadOnePronunciationResolver,
        ReadManyPronunciationsResolver,
        ReadPronunciationIdsForPaginationResolver,
        UpdatePronunciationResolver,
        // User resolvers
        ChangePasswordResolver,
        ForgotPasswordResolver,
        LoginResolver,
        LogoutResolver,
        MeResolver,
        RegisterResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.get("/download-meanings", async (req, res) => {
    try {
      const exported = await AppDataSource.query(
        `
        SELECT e.headword, m.definition, m.usage, m."imageLink", m.notes
        FROM meaning m
        INNER JOIN meaning_entries_entry m_e
        ON m.id = m_e."meaningId"
        INNER JOIN entry e
        ON e.id = m_e."entryId"
        WHERE m."userId" = $1
        ORDER BY m."updatedAt" DESC
      `,
        [req.session.userId]
      );

      const csvHeader = Object.keys(exported[0]).join(",").concat("\n");

      let rows: string[] = [];
      for (let jsonRecord of exported) {
        rows.push(
          Object.values(jsonRecord)
            .map((value) => `"${(value as string).replace(/"/g, '""')}"`) // Escape quotes inside fields
            .join(",")
            .concat("\n")
        );
      }

      const csvRows = [csvHeader, ...rows];
      res.type("text/csv"); // Set response type
      res.setHeader("Content-Disposition", "attachment; filename=meanings.csv");

      const csvStream = new Readable({
        read() {
          csvRows.forEach((row) => {
            this.push(row);
          });
          this.push(null); // End of row
        },
      });

      await promisify(pipeline)(csvStream, res);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  app.get("/download-pronunciations", async (req, res) => {
    try {
      const exported = await AppDataSource.query(
        `
        SELECT e.headword, p.transcription, p.notes
        FROM pronunciation p
        INNER JOIN entry e
        ON e.id = p."entryId"
        WHERE p."userId" = $1
        ORDER BY p."updatedAt" DESC
      `,
        [req.session.userId]
      );

      const csvHeader = Object.keys(exported[0]).join(",").concat("\n");

      let rows: string[] = [];
      for (let jsonRecord of exported) {
        rows.push(
          Object.values(jsonRecord)
            .map((value) => `"${(value as string).replace(/"/g, '""')}"`) // Escape quotes inside fields
            .join(",")
            .concat("\n")
        );
      }

      const csvRows = [csvHeader, ...rows];
      res.type("text/csv"); // Set response type
      res.setHeader("Content-Disposition", "attachment; filename=meanings.csv");

      const csvStream = new Readable({
        read() {
          csvRows.forEach((row) => {
            this.push(row);
          });
          this.push(null); // End of row
        },
      });

      await promisify(pipeline)(csvStream, res);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  app.listen(parseInt(process.env.PORT as string), () => {
    console.log(`Server started on localhost:${process.env.PORT as string}`);
  });
};

main().catch((err) => {
  console.error(err);
});
