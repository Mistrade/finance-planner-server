import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './db_models/user.model';
import { ProfileService } from './profile.service';

const dbModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Global()
@Module({
  imports: [dbModule],
  providers: [ProfileService],
  exports: [ProfileService, dbModule],
})
export class ProfileModule {}
