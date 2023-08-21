import { Module } from "@nestjs/common";
import { ResolveService } from "./resolve.service";

@Module({
  providers: [ResolveService],
  exports: [ResolveService],
})
export class ResolveModule {}