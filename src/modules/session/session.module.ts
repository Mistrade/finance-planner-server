import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { ProfileModule } from '../profile/profile.module';
import { WalletsModule } from '../wallets/wallets.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_CODE,
      signOptions: { expiresIn: '30d' },
    }),
    ProfileModule,
    WalletsModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
