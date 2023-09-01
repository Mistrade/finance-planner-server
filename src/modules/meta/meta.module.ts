import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { Timezone, TimezoneSchema } from './models/timezone.model';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Timezone.name, schema: TimezoneSchema }]),
    ConfigModule
  ],
  controllers: [MetaController],
  providers: [MetaService],
  exports: [MetaService],
})
@Global()
export class MetaModule {
}