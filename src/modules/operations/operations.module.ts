import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { SubscribeModule } from '../subscribe/subscribe.module';
import { TagsModule } from '../tags/tags.module';
import { TargetsModule } from '../targets/targets.module';
import { TemplatesModule } from '../templates/templates.module';
import { WalletsModule } from '../wallets/wallets.module';
import { OperationsBuilderService } from "./operations.builder.service";
import { OperationsController } from './operations.controller';
import { Operation, OperationSchema } from './operations.model';
import { OperationsService } from './operations.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Operation.name, schema: OperationSchema }]),
    TagsModule,
    CategoryModule,
    WalletsModule,
    TargetsModule,
    TemplatesModule,
    SubscribeModule,
  ],
  controllers: [OperationsController],
  providers: [OperationsService, OperationsBuilderService],
})
export class OperationsModule {
}
