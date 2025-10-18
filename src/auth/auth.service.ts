import { Injectable } from '@nestjs/common';
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
    const { email, firstName, lastName, picture } = profile;

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
}
