const Joi = require('@hapi/joi');
import {
  GET_LIST_MAX_LIMIT,
  GET_LIST_MIN_LIMIT,
  GET_LIST_MIN_PAGE
} from './constant';
import { SortFieldEnum, SortTypeEnum } from './enum';

export const paginateValidator = {
  limit: Joi.number()
    .min(GET_LIST_MIN_LIMIT)
    .max(GET_LIST_MAX_LIMIT)
    .optional(),
  page: Joi.number()
    .min(GET_LIST_MIN_PAGE)
    .optional(),
  sortField: Joi.string().valid(...Object.values(SortFieldEnum)),
  sortType: Joi.string().valid(...Object.values(SortTypeEnum))
};
