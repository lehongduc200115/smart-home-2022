const Joi = require('@hapi/joi').extend(require('@joi/date'));
import { RouteOptionsValidate } from '@hapi/hapi';
import { Status } from '../common/enum';
// import { paginateValidator } from '../common/validator';
// import constant from './houses.constant';
import { responseExample } from './__tests__/__mocks__/houses.data';
Joi.objectId = require('joi-objectid')(Joi);

const idParamValidator = Joi.object({
  id: Joi.objectId().required()
});

const createValidator: RouteOptionsValidate = {
  payload: Joi.object({
    name: Joi.string()
      .max(100)
      .required(),
    imgUrl: Joi.string().max(300),
    location: Joi.string().max(300),
    description: Joi.string()
      .max(1000)
      .allow('', null)
      .optional(),
    status: Joi.string()
      .valid(...Object.values(Status))
      .required()
  })
};

const updateValidator: RouteOptionsValidate = {
  params: idParamValidator,
  payload: Joi.object({
    name: Joi.string()
      .max(100)
      .required(),
    imgUrl: Joi.string().max(300),
    location: Joi.string().max(300),
    description: Joi.string()
      .max(1000)
      .allow('', null)
      .optional(),
    status: Joi.string()
      .valid(...Object.values(Status))
      .required()
  })
};

const getValidator: RouteOptionsValidate = {
  params: idParamValidator
};

const responseValidator = Joi.object({
  _id: Joi.exist(),
  name: Joi.string().optional(),
  userId: Joi.string().optional(),
  imgUrl: Joi.string(),
  location: Joi.string(),
  description: Joi.string()
    .allow('', null)
    .optional(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .optional(),
  createdAt: Joi.date(),
  createdBy: Joi.string(),
  updatedAt: Joi.date(),
  updatedBy: Joi.string()
}).example(responseExample);

// const responseListValidator = Joi.object({
//   items: Joi.array().items(responseValidator),
//   pagination: Joi.object({
//     page: Joi.number(),
//     totalPages: Joi.number(),
//     totalItems: Joi.number(),
//     limit: Joi.number()
//   }).optional()
// });

export {
  createValidator,
  updateValidator,
  getValidator,
  responseValidator,
};
