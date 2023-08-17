import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryService } from '../category/category.service';
import { TUserDocument } from "../profile/db_models/user.model";
import { SubscribeService } from "../subscribe/subscribe.service";
import { TagsService } from '../tags/tags.service';
import { TargetsService } from '../targets/targets.service';
import { TemplatesService } from '../templates/templates.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateOperationDto } from "./dto/create.operation.dto";
import { OperationsBuilderService } from './operations.builder.service';
import { Operation, TOperationModel } from './operations.model';

@Injectable()
export class OperationsService {
  constructor(
    private readonly tagService: TagsService,
    private readonly categoryServices: CategoryService,
    private readonly walletService: WalletsService,
    private readonly templateService: TemplatesService,
    private readonly targetService: TargetsService,
    private readonly operationsBuildService: OperationsBuilderService,
    private readonly subscribeService: SubscribeService,
    @InjectModel(Operation.name) private readonly operationModel: TOperationModel,
  ) {
  }
  
  async createOperation(dto: CreateOperationDto, userInfo: TUserDocument): Promise<Operation | null> {
    return null
  }
}
