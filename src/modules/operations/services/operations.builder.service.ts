import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { ISchemaOperationsMain } from '../dto/schema.operations.dto';
import { Operation } from '../operations.model';

@Injectable()
export class OperationsBuilderService {
  constructor() {}

  async buildSchema(list: Array<Operation>): Promise<ISchemaOperationsMain> {
    const result: ISchemaOperationsMain = {};
    
    for (let item of list) {
      const usageDate = dayjs(item.date);
      const year = usageDate.year();
      const month = usageDate.month();
      const date = usageDate.date();

      if (!result[year]) {
        result[year] = {};
      }

      if (!result[year][month]) {
        result[year][month] = {};
      }

      if (!result[year][month][date]) {
        result[year][month][date] = [];
      }

      result[year][month][date].push(item);
    }

    return result;
  }
}
