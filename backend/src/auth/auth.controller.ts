import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// Yahan se /guards/ wala rasta hata diya kyunke file ab same folder mein hai
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body) {
    return this.authService.signup(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // req.user.userId wo ID hai jo JWT token se aati hai
    return this.authService.getProfile(req.user.userId);
  }

  // auth.controller.ts mein ye endpoint add karein
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() body) {
    const { oldPassword, newPassword } = body;

    // JWT Payload se ID nikaalne ka sahi tareeqa
    const id = req.user.userId || req.user.id || req.user.sub;

    if (!id) {
      throw new UnauthorizedException(
        'User ID not found in token. Please re-login.',
      );
    }

    // Number() isliye lagaya taake agar ID string mein ho toh error na aaye
    return this.authService.changePassword(
      Number(id),
      oldPassword,
      newPassword,
    );
  }
}
