import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { argonPasswordService } from 'src/auth/argonPassword.service';
import { JwtService } from 'src/auth/jwt.service';

@Module({
  imports: [], // Import PrismaModule here
  controllers: [UserController],
  providers: [UserService, PrismaService, argonPasswordService, JwtService],
})
export class UserModule {}
