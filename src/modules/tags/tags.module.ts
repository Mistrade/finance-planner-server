import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResolveModule } from '../resolve/resolve.module';
import { TagsController } from './tags.controller';
import { Tag, TagSchema } from './tags.model';
import { TagsService } from './tags.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]), ResolveModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
