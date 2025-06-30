import { Controller, Get, Post, Body, Session, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('status')
  getAuth(@Session() session: Record<string, any>) {
    if (session.loggedIn) {
        return {
            user: process.env.AUTH_USERNAME,
        }
    }
    throw new UnauthorizedException('Unauthorized');
  }

  @Post('login')
  login(@Body() body: { username: string, password: string }, @Session() session: Record<string, any>) {
    const { username, password } = body;

    if (username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD) {
      session.loggedIn = true;
      return {
        message: 'Login successful',
        success: true,
      }
    }

    throw new UnauthorizedException('Invalid username or password');
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>) {
    session.destroy(() => {});
    return {
      message: 'Logout successful',
      success: true,
    }
  }
}
