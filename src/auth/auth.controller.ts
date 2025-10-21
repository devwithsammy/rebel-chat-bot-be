import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    //redirects to google login page
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    const FRONTEND_URL = this.configService.get<string>('FRONTEND_URL');
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
      //   return { message: 'No user info from Google' };
    }
    const { user, token } = req.user;
    const redirectUrl = `${FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}&message=login_success`;
    res.redirect(redirectUrl);
    // return {
    //   message: 'User info from google',
    //   user,
    //   token,
    // };
  }
  @Get('profile')
  @UseGuards(JWTAuthGuard)
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    const userProfile = await this.authService.getProfile(userId);
    return {
      success: true,
      message: 'User profile',
      data: userProfile,
    };
  }
}
