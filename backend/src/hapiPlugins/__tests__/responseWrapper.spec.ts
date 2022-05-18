import { Server, ServerInjectResponse, RouteOptionsValidate } from '@hapi/hapi';
import Joi from '@hapi/joi';
import { ErrorList, ERROR_CODE } from '../../common/errors';
import responseWrapper from '../responseWrapper';
import { AppError } from '../../common/error/AppError';
import { Method, HttpHeaders, StatusCode } from '@swat/hapi-common';

describe('Plugin - responseWrapper', () => {
  const testServer = new Server();
  const testHandler = jest.fn();
  testServer.route([
    {
      method: Method.POST,
      path: '/test',
      options: {
        validate: ({
          payload: Joi.object({
            name: Joi.string()
          })
        } as unknown) as RouteOptionsValidate,
        handler: testHandler
      }
    },
    {
      method: Method.GET,
      path: '/documentation',
      options: {
        handler: () => 'documentation'
      }
    }
  ]);

  testServer.register(responseWrapper);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleHapiResponse', () => {
    it('should wrap success response in data object', async () => {
      testHandler.mockResolvedValueOnce('test result');

      const response: ServerInjectResponse = await testServer.inject({
        method: Method.POST,
        url: '/test',
        payload: {
          name: 'test'
        },
        headers: {
          [HttpHeaders.AUTH]: 'headers bearer token'
        }
      });

      expect(response.result).toEqual('test result');
    });

    it('should wrap AppError response in error object', async () => {
      testHandler.mockRejectedValueOnce(
        new AppError(ERROR_CODE.KAFKA_UNEXPECTED_ERROR)
      );

      const response: ServerInjectResponse = await testServer.inject({
        method: Method.POST,
        url: '/test',
        payload: {
          name: 'test'
        }
      });

      expect(response.result).toEqual({
        error: {
          code: 1304005,
          message: ErrorList[ERROR_CODE.KAFKA_UNEXPECTED_ERROR].message
        }
      });
      expect(response.statusCode).toEqual(
        ErrorList[ERROR_CODE.KAFKA_UNEXPECTED_ERROR].statusCode
      );
    });

    it('should wrap 500 error response in error object', async () => {
      testHandler.mockRejectedValueOnce('unexpected error');

      const response: ServerInjectResponse = await testServer.inject({
        method: Method.POST,
        url: '/test',
        payload: {
          name: 'test'
        }
      });

      expect(response.result).toEqual({
        error: {
          code: StatusCode.INTERNAL_SERVER_ERROR,
          message: 'An internal server error occurred'
        }
      });
      expect(response.statusCode).toEqual(500);
    });

    it('should throw normal error on not server error', async () => {
      const response: ServerInjectResponse = await testServer.inject({
        method: Method.POST,
        url: '/test',
        payload: {
          unwanted: 'error'
        }
      });

      expect(response.result).toEqual({
        error: {
          code: StatusCode.BAD_REQUEST,
          message: 'Invalid request payload input'
        }
      });
      expect(response.statusCode).toEqual(400);
    });

    it('should ignore document path', async () => {
      const response: ServerInjectResponse = await testServer.inject({
        method: Method.GET,
        url: '/documentation'
      });

      expect(response.result).not.toHaveProperty('data');
      expect(response.result).not.toHaveProperty('error');
    });
  });
});
