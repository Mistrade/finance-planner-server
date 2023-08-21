import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { ResolveModule } from "../resolve/resolve.module";
import { SubscribeModule } from '../subscribe/subscribe.module';
import { TagsModule } from '../tags/tags.module';
import { TargetsModule } from '../targets/targets.module';
import { TemplatesModule } from '../templates/templates.module';
import { WalletsModule } from '../wallets/wallets.module';
import { OperationsBuilderService } from "./services/operations.builder.service";
import { OperationsController } from './operations.controller';
import { OperationsFindService } from "./services/operations.find.service";
import { Operation, OperationSchema } from './operations.model';
import { OperationsService } from './services/operations.service';
import { OperationsUpdateService } from "./services/operations.update.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Operation.name, schema: OperationSchema }]),
    TagsModule,
    CategoryModule,
    WalletsModule,
    TargetsModule,
    TemplatesModule,
    SubscribeModule,
    ResolveModule
  ],
  controllers: [OperationsController],
  providers: [OperationsService, OperationsBuilderService, OperationsFindService, OperationsUpdateService],
})
export class OperationsModule {
}
