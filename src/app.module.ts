import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './db/mongo.utils';
import { CategoryModule } from './modules/category/category.module';
import { OperationsModule } from './modules/operations/operations.module';
import { SessionModule } from './modules/session/session.module';
import { SubscribeModule } from './modules/subscribe/subscribe.module';
import { TagsModule } from './modules/tags/tags.module';
import { TargetsModule } from './modules/targets/targets.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { REDIS_NAMESPACES } from './utils/global.constants';

@Module({
  imports: [
    SessionModule,
    OperationsModule,
    TargetsModule,
    WalletsModule,
    TagsModule,
    TemplatesModule,
    CategoryModule,
    SubscribeModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        config: [
          {
            port: configService.get('REDIS_SESSION_PORT'),
            host: configService.get('REDIS_SESSION_HOST'),
            db: 0,
            namespace: REDIS_NAMESPACES.SESSION,
          },
          {
            port: configService.get('REDIS_SESSION_PORT'),
            host: configService.get('REDIS_SESSION_HOST'),
            db: 1,
            namespace: REDIS_NAMESPACES.WALLET_STATE,
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
