import { Global, Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';

@Module({
  providers: [SubscribeService],
  controllers: [SubscribeController],
  exports: [SubscribeService],
})
@Global()
export class SubscribeModule {}
