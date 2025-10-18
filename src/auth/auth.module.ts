import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({
      session: false,
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ||
          '7d') as JwtSignOptions['expiresIn'],
      },
    }),
    
  ],
})
export class AuthModule {}
