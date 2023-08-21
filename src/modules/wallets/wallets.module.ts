import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletCalculateService } from "./wallet.calculate.service";
import { WalletsController } from './wallets.controller';
import { Wallet, WalletSchema } from './wallets.model';
import { WalletsService } from './wallets.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
  ],
  controllers: [WalletsController],
  providers: [WalletsService, WalletCalculateService],
  exports: [WalletsService, WalletCalculateService],
})
export class WalletsModule {}
