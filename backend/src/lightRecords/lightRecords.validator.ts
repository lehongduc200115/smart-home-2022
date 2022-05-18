const Joi = require('@hapi/joi').extend(require('@joi/date'));
import { RouteOptionsValidate } from '@hapi/hapi';
import { Status } from '../common/enum';
// import { paginateValidator } from '../common/validator';
// import constant from './houses.constant';
import { responseExample } from './__tests__/__mocks__/lightRecords.data';
Joi.objectId = require('joi-objectid')(Joi);

const idParamValidator = Joi.object({
  id: Joi.objectId().required()
});

const createValidator: RouteOptionsValidate = {
  payload: Joi.object({
    houseId: Joi.string()
      .max(100)
      .required(),
    recordId: Joi.string()
      .max(100)
      .required(),   
    recordTime: Joi.date()
      .required(),
    value: Joi.string()
      .required(),
    status: Joi.string()
      .valid(...Object.values(Status))
      .optional()
  })
};

const getValidator: RouteOptionsValidate = {
  params: idParamValidator
};

const responseValidator = Joi.object({
  _id: Joi.exist(),
  houseId: Joi.string().optional(),
  recordId: Joi.string().optional(),
  recordTime: Joi.date(),
  value: Joi.string(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .optional(),
  createdAt: Joi.date(),
  createdBy: Joi.string(),
  updatedAt: Joi.date(),
  updatedBy: Joi.string()
}).example(responseExample);

export { createValidator, getValidator, responseValidator };
