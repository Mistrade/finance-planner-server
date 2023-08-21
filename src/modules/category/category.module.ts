import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResolveModule } from "../resolve/resolve.module";
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './category.model';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    ResolveModule,
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
