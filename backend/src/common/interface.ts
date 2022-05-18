import Joi from '@hapi/joi';
import { RuleCondition, SortTypeEnum } from './enum';

export interface IPaginationParams {
  limit: number;
  offset: number;
  page: number;
  sortType: SortTypeEnum | number;
  sortField: string;
}

export interface IPagination {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}
export interface IResponseList<T> {
  items: T;
  pagination: IPagination;
}
export interface IError {
  message: string;
  businessCode: string;
  code: string;
}

export interface IErrorResponse {
  error: IError;
  additionalData: { [key: string]: any };
}

export interface IErrorDetails {
  message: string;
  key: string;
  code: string;
}

export interface AdditionalData {
  [key: string]: any;
}

export interface IUserData {
  userID: string;
  fullName: string;
  email: string;
}

export interface IClientData {
  programId: string;
  brandId: string;
}

export const errorSchema = Joi.object({
  error: Joi.object({
    message: Joi.string(),
    code: Joi.number(),
    errors: Joi.array().items(Joi.object())
  })
});

export interface IOperator {
  operator: RuleCondition;
}
