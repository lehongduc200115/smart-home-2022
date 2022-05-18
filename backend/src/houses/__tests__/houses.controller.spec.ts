import { Server, ServerInjectResponse } from '@hapi/hapi';
import { Method, StatusCode } from '@swat/hapi-common';
import querystring from 'querystring';
import {
  GET_LIST_DEFAULT_LIMIT,
  GET_LIST_DEFAULT_PAGE
} from '../../common/constant';
import constant from '../houses.constant';
import houseController from '../houses.controller';
import houseService from '../houses.service';
import {
  houseExpected,
  housePayload,
  houseQuery,
  houseProfileCompletionPayload,
  houseProfileCompletionExpected
} from './__mocks__/houses.data';

jest.mock('../houses.service');

let server: Server;

describe('houses.controller', () => {
  const invalidResponse = {
    error: 'Bad Request',
    message: 'Invalid request payload input',
    statusCode: StatusCode.BAD_REQUEST
  };

  beforeAll(async () => {
    server = new Server();
    server.route(houseController);
  });

  afterEach(() => {
    expect.hasAssertions();
    jest.resetAllMocks();
  });

  describe('#Get house list', () => {
    it('should call get service and response data', async () => {
      const query = querystring.stringify(houseQuery);
      houseService.getList = jest.fn().mockResolvedValueOnce({
        items: [houseExpected],
        pagination: {
          totalItems: 1,
          page: GET_LIST_DEFAULT_PAGE,
          totalPages: 1,
          limit: GET_LIST_DEFAULT_LIMIT
        }
      });
      const response: ServerInjectResponse = await server.inject({
        method: Method.GET,
        url: `/${constant.CAMPAIGNS_PATH}?${query}`
      });

      expect(response.statusCode).toEqual(StatusCode.OK);
      expect(response.result).toEqual({
        items: [houseExpected],
        pagination: {
          totalItems: 1,
          page: GET_LIST_DEFAULT_PAGE,
          totalPages: 1,
          limit: GET_LIST_DEFAULT_LIMIT
        }
      });
      expect(houseService.getList).toHaveBeenCalled();
    });
  });
  describe('#Get house by id', () => {
    it('should call get service and response data', async () => {
      houseService.getById = jest
        .fn()
        .mockResolvedValueOnce({ toObject: () => houseExpected });
      const id = '60f844d027af5dc14d85a660';
      const response: ServerInjectResponse = await server.inject({
        method: Method.GET,
        url: `/${constant.CAMPAIGNS_PATH}/${id}`
      });

      expect(response.statusCode).toEqual(StatusCode.OK);
      expect(response.result).toEqual(houseExpected);
    });
    it('should call get service when get house with type PROFILE_COMPLETION and response data', async () => {
      houseService.getById = jest.fn().mockResolvedValueOnce({
        toObject: () => houseProfileCompletionExpected
      });
      const id = '60f844d027af5dc14d85a660';
      const response: ServerInjectResponse = await server.inject({
        method: Method.GET,
        url: `/${constant.CAMPAIGNS_PATH}/${id}`
      });

      expect(response.statusCode).toEqual(StatusCode.OK);
      expect(response.result).toEqual(houseProfileCompletionExpected);
    });
  });

  describe('#Create house', () => {
    it('should throw BAD_REQUEST with invalid payload', async () => {
      const payload = {
        ...housePayload,
        status: 'test'
      };
      const response: ServerInjectResponse = await server.inject({
        method: Method.POST,
        url: `/${constant.CAMPAIGNS_PATH}`,
        payload: JSON.stringify(payload)
      });
      expect(houseService.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toEqual(StatusCode.BAD_REQUEST);
      expect(response.result).toEqual(invalidResponse);
    });

    it('should call houseService and response successfully', async () => {
      houseService.create = jest
        .fn()
        .mockResolvedValueOnce({ toObject: () => houseExpected });

      const response: ServerInjectResponse = await server.inject({
        method: Method.POST,
        url: `/${constant.CAMPAIGNS_PATH}`,
        headers: {
          'auth-program-id': 'programId'
        },
        payload: JSON.stringify(housePayload)
      });

      expect(response.result).toEqual(houseExpected);
    });

    it('should call houseService when create house with type PROFILE_COMPLETION and response successfully', async () => {
      houseService.create = jest.fn().mockResolvedValueOnce({
        toObject: () => houseProfileCompletionExpected
      });

      const response: ServerInjectResponse = await server.inject({
        method: Method.POST,
        url: `/${constant.CAMPAIGNS_PATH}`,
        headers: {
          'auth-program-id': 'programId'
        },
        payload: JSON.stringify(houseProfileCompletionPayload)
      });

      expect(response.result).toEqual(houseProfileCompletionExpected);
    });
  });

  describe('#Update house by id', () => {
    it('should call houseService and response successfully', async () => {
      houseService.updateById = jest
        .fn()
        .mockResolvedValueOnce({ toObject: () => houseExpected });
      const id = '60f844d027af5dc14d85a660';
      const response: ServerInjectResponse = await server.inject({
        method: Method.PATCH,
        url: `/${constant.CAMPAIGNS_PATH}/${id}`,
        headers: {
          'auth-program-id': 'programId'
        },
        payload: housePayload
      });

      expect(response.result).toEqual(houseExpected);
    });

    it('should call houseService when update house with type PROFILE_COMPLETION and response successfully', async () => {
      houseService.updateById = jest.fn().mockResolvedValueOnce({
        toObject: () => houseProfileCompletionExpected
      });
      const id = '60f844d027af5dc14d85a660';
      const response: ServerInjectResponse = await server.inject({
        method: Method.PATCH,
        url: `/${constant.CAMPAIGNS_PATH}/${id}`,
        headers: {
          'auth-program-id': 'programId'
        },
        payload: houseProfileCompletionPayload
      });

      expect(response.result).toEqual(houseProfileCompletionExpected);
    });
  });

  describe('#Get for rundeck', () => {
    it('should return success if has data', async () => {
      houseService.getForRunDeck = jest
        .fn()
        .mockReturnValue({ data: 'data' });
      const id = '60f844d027af5dc14d85a660';
      const response: ServerInjectResponse = await server.inject({
        method: Method.GET,
        url: `/${constant.CAMPAIGNS_PATH}/job/${id}`
      });
      expect(response.statusCode).toEqual(StatusCode.OK);
    });
    it('should return NO_CONTENT if no data', async () => {
      houseService.getForRunDeck = jest.fn().mockReturnValue(undefined);
      const id = '60f844d027af5dc14d85a660';
      const response: ServerInjectResponse = await server.inject({
        method: Method.GET,
        url: `/${constant.CAMPAIGNS_PATH}/job/${id}`
      });
      expect(response.statusCode).toEqual(StatusCode.NO_CONTENT);
    });
  });
});
