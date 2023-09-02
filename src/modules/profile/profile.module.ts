import { HttpModule } from "@nestjs/axios";
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from "./profile.controller";
import { Profile, UserSchema } from './profile.model';
import { ProfileService } from './profile.service';

const dbModule = MongooseModule.forFeature([{ name: Profile.name, schema: UserSchema }]);

@Global()
@Module({
  imports: [dbModule, HttpModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService, dbModule],
})
export class ProfileModule {}
