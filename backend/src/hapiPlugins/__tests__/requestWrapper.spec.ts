import { Server, ServerInjectResponse } from '@hapi/hapi';
import requestWrapper from '../requestWrapper';
import responseWrapper from '../responseWrapper';

import { get } from 'lodash';
import { HttpHeaders, Method } from '@swat/hapi-common';

jest.mock('cls-hooked', () => {
  const origin = jest.requireActual('cls-hooked');
  return {
    ...origin,
    getNamespace: jest.fn().mockReturnValue({
      context: 'context'
    })
  };
});
describe('Plugin - requestWrapper', () => {
  const testServer = new Server();
  testServer.route([
    {
      method: Method.GET,
      path: '/test',
      options: {
        handler: () => 'test'
      }
    }
  ]);

  testServer.register([requestWrapper, responseWrapper]);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleHapiRequest', () => {
    it('should continue with request made without any error', async () => {
      const response: ServerInjectResponse = await testServer.inject({
        method: Method.GET,
        url: '/test',
        headers: {
          [HttpHeaders.LANGUAGE]: 'vn'
        }
      });
      expect(get(response, 'result')).toEqual('test');
    });

    it('should continue with request have config headers', async () => {
      const response: ServerInjectResponse = await testServer.inject({
        method: Method.GET,
        url: '/test',
        headers: {
          referer: 'https://localhost',
          'x-forwarded-host': 'http//localhost',
          'x-forwarded-port': '8080',
          'content-type': 'application/json, application/json'
        }
      });
      const headers = response.request.headers;
      expect(headers['content-type']).toEqual('application/json');
      expect(headers['x-forwarded-proto']).toEqual('https');
      expect(headers['x-forwarded-host']).toEqual('http//localhost:8080');
      expect(get(response, 'result')).toEqual('test');
    });
  });
});
