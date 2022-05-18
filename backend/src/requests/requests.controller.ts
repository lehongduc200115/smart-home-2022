import { ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { Method, StatusCode } from '@swat/hapi-common';
import { Request } from 'hapi';
import util from '../util';
import constant from './requests.constant';
import { IRequest, IRequestRequest } from './requests.interface';
import requestService from './requests.service';
import {
  createValidator,
  getValidator,
  responseValidator,
} from './requests.validator';

const get: ServerRoute = {
  method: Method.GET,
  path: `/${constant.REQUESTS_PATH}/{id}`,
  options: {
    description: 'Get Requests by id',
    tags: ['api', 'Requests'],
    validate: getValidator,
    response: {
      status: {
        [StatusCode.OK]: responseValidator
      }
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await requestService.getById(request.params.id);
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
  path: `/${constant.REQUESTS_PATH}`,
  options: {
    description: 'Create Request',
    tags: ['api', 'Requests'],
    validate: createValidator,
    response: {
      status: {
        [StatusCode.CREATED]: responseValidator
      }
    },
    handler: async (request: IRequestRequest, h: ResponseToolkit) => {
      const userData = util.getHeaderUserData(request.headers);
      const payload: IRequest = {
        userId: userData.userId,
        ...request.payload,
        createdBy: userData.email,
        updatedBy: userData.email
      };
      const data = await requestService.create(payload);
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

const requestController: ServerRoute[] = [
  create,
  get,
];
export default requestController;
