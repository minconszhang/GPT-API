import { Controller, Get, Post, Body, Session, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DbService } from '../db/db.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly dbService: DbService) { }

  @Get('status')
  getAuth(@Session() session: Record<string, any>) {
    if (session.loggedIn && session.user) {
      return {
        user: session.user,
        success: true,
      }
    }
    throw new UnauthorizedException('Unauthorized');
  }

  @Post('login')
  async login(@Body() body: { username: string, password: string }, @Session() session: Record<string, any>) {
    const { username, password } = body;

    try {
      const query = 'SELECT * FROM users WHERE username = $1';
      const result = await this.dbService.getPool().query(query, [username]);

      if (result.rows.length === 0) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const user = result.rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid username or password');
      }

      session.loggedIn = true;
      session.user = user.username;
      return {
        message: 'Login successful',
        success: true,
      }

    } catch (error) {
      console.error('Error logging in:', error);
      throw new InternalServerErrorException('Failed to log in');
    }
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>) {
    session.destroy(() => { });
    return {
      message: 'Logout successful',
      success: true,
    }
  }

  @Post('signup')
  async signup(@Body() body: { username: string, password: string }) {
    const { username, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, password_hash) VALUES ($1, $2)';

    try {
      await this.dbService.getPool().query(query, [username, hashedPassword]);
    } catch (error) {
      console.error('Error signing up:', error);
      throw new InternalServerErrorException('Failed to sign up');
    }

    return {
      message: 'Signup successful',
      success: true,
    }
  }
}
