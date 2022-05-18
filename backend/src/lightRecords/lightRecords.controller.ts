import { ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { Method, StatusCode } from '@swat/hapi-common';
import { Request } from 'hapi';
import util from '../util';
import constant from './lightRecords.constant';
import { ILightRecord, ILightRecordRequest } from './lightRecords.interface';
import requestService from './lightRecords.service';
import {
  createValidator,
  getValidator,
  responseValidator,
} from './lightRecords.validator';

const get: ServerRoute = {
  method: Method.GET,
  path: `/${constant.LIGHT_RECORDS_PATH}/{id}`,
  options: {
    description: 'Get Light Records by id',
    tags: ['api', 'Light Records'],
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
  path: `/${constant.LIGHT_RECORDS_PATH}`,
  options: {
    description: 'Create Light Records',
    tags: ['api', 'Light Records'],
    validate: createValidator,
    response: {
      status: {
        [StatusCode.CREATED]: responseValidator
      }
    },
    handler: async (request: ILightRecordRequest, h: ResponseToolkit) => {
      const userData = util.getHeaderUserData(request.headers);
      const payload: ILightRecord = {
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

const lightRecordsController: ServerRoute[] = [
  create,
  get,
];
export default lightRecordsController;
