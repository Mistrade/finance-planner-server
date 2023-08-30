import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { ResolveModule } from '../resolve/resolve.module';
import { SubscribeModule } from '../subscribe/subscribe.module';
import { TagsModule } from '../tags/tags.module';
import { TargetsModule } from '../targets/targets.module';
import { TemplatesModule } from '../templates/templates.module';
import { WalletsModule } from '../wallets/wallets.module';
import { OperationDeleteController } from './controllers/operation.delete.controller';
import { OperationGetController } from './controllers/operation.get.controller';
import { OperationPatchController } from './controllers/operation.patch.controller';
import { OperationPostController } from './controllers/operation.post.controller';
import { Operation, OperationSchema } from './operations.model';
import { OperationRemoveService } from './services/operation.remove.service';
import { OperationsBuilderService } from './services/operations.builder.service';
import { OperationsCreateService } from './services/operations.create.service';
import { OperationsFindService } from './services/operations.find.service';
import { OperationsUpdateService } from './services/operations.update.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Operation.name, schema: OperationSchema }]),
    TagsModule,
    CategoryModule,
    WalletsModule,
    TargetsModule,
    TemplatesModule,
    SubscribeModule,
    ResolveModule,
  ],
  controllers: [OperationDeleteController, OperationGetController, OperationPostController, OperationPatchController],
  providers: [
    OperationsCreateService,
    OperationsBuilderService,
    OperationsFindService,
    OperationsUpdateService,
    OperationRemoveService,
  ],
  exports: [OperationsFindService],
})
export class OperationsModule {
}
