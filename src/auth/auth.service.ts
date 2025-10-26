import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateOrCreateUser(profile: any): Promise<any> {
    const { email, firstName, lastName, picture } = profile || {};

    let user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      user = await this.userModel.create({
        email,
        firstName,
        lastName,
        picture,
        googleId: profile.googleId,
      });
    }

    const payload = {
      sub: user?._id,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);
    return {
      user,
      token,
    };
  }
  async getProfile(userId?: string): Promise<any> {
    if (!userId) throw new BadRequestException('UserId is required');
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      message: 'User profile',
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        picture: user.picture,
        googleId: user.googleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
