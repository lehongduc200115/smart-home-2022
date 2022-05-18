import { ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { Method, StatusCode } from '@swat/hapi-common';
import { Request } from 'hapi';
import util from '../util';
import constant from './houses.constant';
import { IHouse, IHouseRequest } from './houses.interface';
import houseService from './houses.service';
import {
  createValidator,
  getValidator,
  responseValidator,
  updateValidator,
} from './houses.validator';

const get: ServerRoute = {
  method: Method.GET,
  path: `/${constant.HOUSES_PATH}/{id}`,
  options: {
    description: 'Get houses by id',
    tags: ['api', 'Houses'],
    validate: getValidator,
    response: {
      status: {
        [StatusCode.OK]: responseValidator
      }
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await houseService.getById(request.params.id);
      return h.response(data.toObject()).code(StatusCode.OK);
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          [StatusCode.OK]: {
            description: 'OK'
          }
        }
      }
    }
  }
};
const create: ServerRoute = {
  method: Method.POST,
  path: `/${constant.HOUSES_PATH}`,
  options: {
    description: 'Create House',
    tags: ['api', 'Houses'],
    validate: createValidator,
    response: {
      status: {
        [StatusCode.CREATED]: responseValidator
      }
    },
    handler: async (request: IHouseRequest, h: ResponseToolkit) => {
      const userData = util.getHeaderUserData(request.headers);
      const payload: IHouse = {
        userId: userData.userId,
        ...request.payload,
        createdBy: userData.email,
        updatedBy: userData.email
      };
      const data = await houseService.create(payload);
      return h.response(data.toObject()).code(StatusCode.CREATED);
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          [StatusCode.CREATED]: {
            description: 'Created'
          }
        }
      }
    }
  }
};
const update: ServerRoute = {
  method: Method.PATCH,
  path:  `/${constant.HOUSES_PATH}/{id}`,
  options: {
    description: 'Update House by id',
    tags: ['api', 'Houses'],
    validate: updateValidator,
    response: {
      status: {
        [StatusCode.CREATED]: responseValidator
      }
    },
    handler: async (request: IHouseRequest, h: ResponseToolkit) => {
      const userData = util.getHeaderUserData(request.headers);
      const payload: IHouse = {
        userId: userData.userId,
        ...request.payload,
        createdBy: userData.email,
        updatedBy: userData.email
      };
      const data = await houseService.updateById(request.params.id, payload);
      return h.response(data.toObject()).code(StatusCode.OK);
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          [StatusCode.CREATED]: {
            description: 'Created'
          }
        }
      }
    }
  }
};

const houseController: ServerRoute[] = [
  create,
  get,
  update,
];
export default houseController;
