import { Global, Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { MetaModule } from "../meta/meta.module";
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
    MetaModule,
    ConfigModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
