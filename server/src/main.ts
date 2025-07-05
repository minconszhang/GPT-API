import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as pg from 'pg';
import * as PgStore from 'connect-pg-simple';

const logger = new Logger('Main');

const PgSession = PgStore(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(session({
    store: new PgSession({
      pool: pgPool,
      tableName: 'user_session',
      pruneSessionInterval: 24 * 60 * 60,
      createTableIfMissing: true,
    }),
    secret: 'hi-bob-is-a-good-boy-and-he-is-a-good-boy',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cors());

  await app.listen(process.env.PORT ?? 3888);
}
bootstrap();
