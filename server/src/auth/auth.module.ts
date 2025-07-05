import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DbService } from '../db/db.service';

@Module({
  controllers: [AuthController],
  providers: [DbService],
})
export class AuthModule {}
