const Joi = require('@hapi/joi').extend(require('@joi/date'));
import { RouteOptionsValidate } from '@hapi/hapi';
import { Status } from '../common/enum';
import { RequestStatus, RequestType } from './requests.enum';
// import { paginateValidator } from '../common/validator';
// import constant from './houses.constant';
import { responseExample } from './__tests__/__mocks__/requests.data';
Joi.objectId = require('joi-objectid')(Joi);

const idParamValidator = Joi.object({
  id: Joi.objectId().required()
});

const createValidator: RouteOptionsValidate = {
  payload: Joi.object({
    houseId: Joi.string()
      .max(100)
      .required(),
    requestType: Joi.string()
      .valid(...Object.values(RequestType))
      .required(),
    requestStatus: Joi.string()
      .valid(...Object.values(RequestStatus))
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
  userId: Joi.string().optional(),
  requestStatus: Joi.string()
    .valid(...Object.values(RequestStatus)),  
  requestType: Joi.string()
    .valid(...Object.values(RequestType)),
  status: Joi.string()
    .valid(...Object.values(Status))
    .optional(),
  createdAt: Joi.date(),
  createdBy: Joi.string(),
  updatedAt: Joi.date(),
  updatedBy: Joi.string()
}).example(responseExample);

export { createValidator, getValidator, responseValidator };
