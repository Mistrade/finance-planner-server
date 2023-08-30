import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { exhaustiveCheck } from '../../../utils/exception.data';
import { OPERATION_STATE, OPERATION_TYPES } from '../operations.constants';
import { Operation } from '../operations.model';
import { IOperationsSchemaCalculated } from '../operations.types';

export class OperationsSchemaCalculated implements IOperationsSchemaCalculated {
  @ApiProperty({ name: 'summaryCount', description: 'Общее количество операций в выборке', type: Number })
  summaryCount: 0; //+

  @ApiProperty({ name: 'realiseCount', description: 'Количество реализованных операций', type: Number })
  realiseCount: number = 0; //+

  @ApiProperty({ name: 'realiseSummaryIncome', description: 'Сумма реализованных доходных операций', type: Number })
  realiseSummaryIncome: number = 0; //+

  @ApiProperty({
    name: 'realiseSummaryConsumption',
    description: 'Сумма реализованных расходных операций',
    type: Number,
  })
  realiseSummaryConsumption: number = 0; //+

  @ApiProperty({ name: 'realiseIncomeCount', description: 'Количество реализованных доходных операций', type: Number })
  realiseIncomeCount: number = 0; //+

  @ApiProperty({
    name: 'realiseConsumptionCount',
    description: 'Количество реализованных расходных операций',
    type: Number,
  })
  realiseConsumptionCount: number = 0; //+

  @ApiProperty({ name: 'realiseProfit', description: 'Сумма доходов и расходов реализованных операций', type: Number })
  realiseProfit: number = 0;

  @ApiProperty({ name: 'planningCount', description: 'Количество запланированных операций', type: Number })
  planningCount: number = 0; //+
  @ApiProperty({ name: 'planningSummaryIncome', description: 'Сумма запланированных доходных операций', type: Number })
  planningSummaryIncome: number = 0; //+
  @ApiProperty({
    name: 'planningSummaryConsumption',
    description: 'Сумма запланированных расходных операций',
    type: Number,
  })
  planningSummaryConsumption: number = 0; //+
  @ApiProperty({
    name: 'planningIncomeCount',
    description: 'Количество запланированных доходных операций',
    type: Number,
  })
  planningIncomeCount: number = 0; //+
  @ApiProperty({
    name: 'planningConsumptionCount',
    description: 'Количество запланированных расходных операций',
    type: Number,
  })
  planningConsumptionCount: number = 0; //+
  @ApiProperty({
    name: 'planningProfit',
    description: 'Сумма доходов и расходов запланированных операций',
    type: Number,
  })
  planningProfit: number = 0;

  @ApiProperty({
    name: 'bestRealiseIncome',
    type: Operation,
    nullable: true,
    description: 'Самая доходная реализованная операция',
  })
  bestRealiseIncome: Operation | null = null; //+
  
  @ApiProperty({
    name: 'bestRealiseConsumption',
    type: Operation,
    nullable: true,
    description: 'Самая расходная реализованная операция',
  })
  bestRealiseConsumption: Operation | null = null; //+
  
  @ApiProperty({
    name: 'bestPlanningIncome',
    type: Operation,
    nullable: true,
    description: 'Самая доходная запланированная операция',
  })
  bestPlanningIncome: Operation | null = null; //+
  
  @ApiProperty({
    name: 'bestPlanningConsumption',
    nullable: true,
    description: 'Самая расходная запланированная операция',
    type: Operation
  })
  bestPlanningConsumption: Operation | null = null; //+

  constructor(arr?: Array<Operation>) {
    arr?.forEach((item) => {
      this.addOperation(item);
    });
  }

  addOperation(operation: Operation) {
    this.summaryCount++;

    switch (operation.state) {
      case OPERATION_STATE.REALISE: {
        this.addRealiseOperation(operation);
        break;
      }
      case OPERATION_STATE.PLANNING: {
        this.addPlanningOperation(operation);
        break;
      }
      default: {
        exhaustiveCheck(operation.state);
        break;
      }
    }

    this.planningProfit = this.planningSummaryIncome - this.planningSummaryConsumption;
    this.realiseProfit = this.realiseSummaryIncome - this.realiseSummaryConsumption;
  }

  private addRealiseOperation(operation: Operation) {
    this.realiseCount++;

    switch (operation.type) {
      case OPERATION_TYPES.CONSUMPTION: {
        this.realiseConsumptionCount++;
        this.realiseSummaryConsumption += operation.cost;
        if (!this.bestRealiseConsumption || operation.cost < this.bestRealiseConsumption.cost) {
          this.bestRealiseConsumption = operation;
        }
        break;
      }
      case OPERATION_TYPES.INCOME: {
        this.realiseIncomeCount++;
        this.realiseSummaryIncome += operation.cost;
        if (!this.bestRealiseIncome || operation.cost > this.bestRealiseIncome.cost) {
          this.bestRealiseIncome = operation;
        }
        break;
      }
      default: {
        exhaustiveCheck(operation.type);
        break;
      }
    }
  }

  private addPlanningOperation(operation: Operation) {
    this.planningCount++;

    switch (operation.type) {
      case OPERATION_TYPES.CONSUMPTION: {
        this.planningConsumptionCount++;
        this.planningSummaryConsumption += operation.cost;
        if (!this.bestPlanningConsumption || operation.cost < this.bestPlanningConsumption.cost) {
          this.bestPlanningConsumption = operation;
        }
        break;
      }
      case OPERATION_TYPES.INCOME: {
        this.planningIncomeCount++;
        this.planningSummaryIncome += operation.cost;
        if (!this.bestPlanningIncome || operation.cost > this.bestPlanningIncome.cost) {
          this.bestPlanningIncome = operation;
        }
        break;
      }
      default: {
        exhaustiveCheck(operation.type);
        break;
      }
    }
  }
}
