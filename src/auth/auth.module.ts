import { Module } from '@nestjs/common';
import { argonPasswordService } from './argonPassword.service';
import { JwtService } from './jwt.service';

@Module({
  controllers: [],
  providers: [argonPasswordService, JwtService],
})
export class AuthModule {}
