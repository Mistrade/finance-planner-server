import { Types } from 'mongoose';
import { OPERATION_STATE, OPERATION_TYPES } from './operations.constants';
import { Operation } from "./operations.model";

export interface IAggregateOperationsBalance {
  _id: { wallet: Types.ObjectId; state: OPERATION_STATE; type: OPERATION_TYPES };
  balance: number;
}

export interface IOperationsSchemaCalculated {
  //Общие поля
  summaryCount;
  
  //Поля с базовой аналитикой по реализованным операциям
  realiseCount: number;
  realiseSummaryIncome: number;
  realiseSummaryConsumption: number;
  realiseIncomeCount: number;
  realiseConsumptionCount: number;
  realiseProfit: number;
  
  //Поля с базовой аналитикой по запланированным операциям
  planningCount: number;
  planningSummaryIncome: number;
  planningSummaryConsumption: number;
  planningIncomeCount: number;
  planningConsumptionCount: number;
  planningProfit: number;
  
  //Поля с крайними (по стоимости) операциями
  bestRealiseIncome: Operation | null;
  bestRealiseConsumption: Operation | null;
  bestPlanningIncome: Operation | null;
  bestPlanningConsumption: Operation | null;
  
}
