import {
  GET_LIST_DEFAULT_LIMIT,
  GET_LIST_DEFAULT_PAGE
} from '../../common/constant';
import { SortFieldEnum, Status } from '../../common/enum';
import { AppError } from '../../common/error/AppError';
import { IPaginationParams } from '../../common/interface';
import commonUtil from '../../common/util';
import { PointType, ScheduledEventType } from '../campaigns.enum';
import campaignRepository from '../campaigns.repository';
import campaignService from '../campaigns.service';
import ruleEngineService from '../../ruleEngines/ruleEngines.service';
import {
  awardsData,
  campaignExpected,
  campaignInput,
  campaignInputInvalid,
  campaignProfileCompletionInput,
  campaignQuery,
  conditionsMessage
} from './__mocks__/campaigns.data';
import {
  ruleEnginExpected,
  ruleEnginBirthmonthExpected,
  ruleEnginProfileCompletionExpected
} from '../../ruleEngines/__tests__/__mocks__/ruleEngines.data';
import campaignsUtil from '../campaigns.util';
import { importJob } from '../../rundeck/rundeck.handler';
import campaignProducer from '../campaigns.producer';
import { ERROR_CODE } from '../../common/errors';
jest.mock('../campaigns.util');
jest.mock('../campaigns.repository');

jest.mock('../../rundeck/rundeck.handler');

describe('campaigns.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    expect.hasAssertions();
  });

  describe('#create campaign by id', () => {
    it('should call create successfully', async () => {
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected]);
      campaignRepository.create = jest
        .fn()
        .mockResolvedValueOnce(campaignInput);
      campaignRepository.getListWithoutPaginate = jest
        .fn()
        .mockResolvedValueOnce([]);
      campaignsUtil.getRuleListFromPayload = jest
        .fn()
        .mockReturnValue(['60f844d027af5dc14d85a660']);

      const result = await campaignService.create(campaignInput);

      expect(campaignRepository.create).toBeCalled();
      expect(result).toEqual(campaignInput);
    });

    it('should call create successfully with duplicate priority', async () => {
      campaignsUtil.getRuleListFromPayload = jest
        .fn()
        .mockReturnValue(['60f844d027af5dc14d85a660']);
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected]);
      campaignRepository.getListWithoutPaginate = jest
        .fn()
        .mockResolvedValueOnce([{ ...campaignInput, _id: 'id' }]);
      campaignRepository.updateMany = jest.fn();
      campaignRepository.create = jest
        .fn()
        .mockResolvedValueOnce(campaignInput);

      const result = await campaignService.create(campaignInput);

      expect(campaignRepository.create).toHaveBeenCalled();
      expect(campaignRepository.updateMany).toHaveBeenCalledWith(
        {
          _id: { $in: ['id'] }
        },
        { $inc: { priority: 1 } }
      );
      expect(result).toEqual(campaignInput);
    });

    it('should call create fail', async () => {
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected]);
      campaignRepository.create = jest
        .fn()
        .mockRejectedValueOnce(new AppError(ERROR_CODE.INVALID_FIELD));
      campaignRepository.getListWithoutPaginate = jest
        .fn()
        .mockResolvedValueOnce([]);

      ruleEngineService.getListByRuleIds = jest.fn().mockResolvedValueOnce([]);

      const error = await campaignService.create(campaignInput).catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });
    it('should call create fail because of mismatching in type', async () => {
      campaignsUtil.getRuleListFromPayload = jest
        .fn()
        .mockReturnValue(['60f844d027af5dc14d85a660']);
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginBirthmonthExpected]);
      campaignRepository.create = jest
        .fn()
        .mockResolvedValueOnce(campaignInput);

      campaignsUtil.validateRules = jest
        .fn()
        .mockRejectedValueOnce(new AppError(ERROR_CODE.INVALID_FIELD));
      campaignRepository.getListWithoutPaginate = jest
        .fn()
        .mockResolvedValueOnce([]);

      const error = await campaignService.create(campaignInput).catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });
    it('should call create fail because of rule duplication', async () => {
      campaignsUtil.getRuleListFromPayload = jest
        .fn()
        .mockReturnValue([
          '60f844d027af5dc14d85a660',
          '60f844d027af5dc14d85a660'
        ]);
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected, ruleEnginExpected]);
      campaignsUtil.validateRules = jest
        .fn()
        .mockRejectedValueOnce(new AppError(ERROR_CODE.INVALID_FIELD));
      campaignRepository.create = jest
        .fn()
        .mockResolvedValueOnce(campaignInput);
      campaignRepository.getListWithoutPaginate = jest
        .fn()
        .mockResolvedValueOnce([]);

      const error = await campaignService.create(campaignInput).catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should call create fail if invalidDate', async () => {
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected]);
      campaignRepository.create = jest
        .fn()
        .mockRejectedValueOnce(new AppError(ERROR_CODE.INVALID_FIELD));
      campaignRepository.getListWithoutPaginate = jest
        .fn()
        .mockResolvedValueOnce([]);

      ruleEngineService.getListByRuleIds = jest.fn().mockResolvedValueOnce([]);

      const error = await campaignService
        .create(campaignInputInvalid)
        .catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('#Get campaign list', () => {
    it.each([
      [
        campaignQuery,
        {
          $and: [
            {
              startDate: {
                $gte: new Date('2021-10-18T00:00:00.000Z')
              }
            },
            {
              endDate: {
                $lte: new Date('2021-10-18T00:00:00.000Z')
              }
            },
            { 'awards.type': PointType.FIXED }
          ],
          $or: [
            {
              name: {
                $options: 'i',
                $regex: 'test'
              }
            },
            {
              type: {
                $options: 'i',
                $regex: 'test'
              }
            }
          ],
          status: Status.ACTIVE
        }
      ],
      [
        {
          status: Status.ACTIVE
        },
        {
          status: Status.ACTIVE
        }
      ],
      [
        {
          searchText: 'test'
        },
        {
          $or: [
            {
              name: {
                $options: 'i',
                $regex: 'test'
              }
            },
            {
              type: {
                $options: 'i',
                $regex: 'test'
              }
            }
          ]
        }
      ],
      [
        {
          startDate: '2021-10-18T00:00:00.000Z',
          endDate: '2021-10-18T00:00:00.000Z'
        },
        {
          $and: [
            {
              startDate: {
                $gte: new Date('2021-10-18T00:00:00.000Z')
              }
            },
            {
              endDate: {
                $lte: new Date('2021-10-18T00:00:00.000Z')
              }
            }
          ]
        }
      ],
      [
        {
          pointType: PointType.FIXED
        },
        {
          $and: [{ 'awards.type': PointType.FIXED }]
        }
      ]
    ])('should call get detail successfully', async (search, expected) => {
      const paginationParams: IPaginationParams = {
        limit: GET_LIST_DEFAULT_LIMIT,
        page: GET_LIST_DEFAULT_PAGE,
        sortField: SortFieldEnum.UPDATED_AT,
        sortType: 1,
        offset: GET_LIST_DEFAULT_LIMIT * GET_LIST_DEFAULT_PAGE
      };
      campaignRepository.getList = jest
        .fn()
        .mockResolvedValueOnce([{ toObject: () => campaignInput }]);
      campaignRepository.countByParameter = jest.fn().mockResolvedValueOnce(1);
      commonUtil.getPaginationParams = jest
        .fn()
        .mockReturnValueOnce(paginationParams);

      const result = await campaignService.getList(search);

      expect(campaignRepository.getList).toHaveBeenCalledWith(
        expected,
        paginationParams
      );
      expect(result).toEqual({
        items: [campaignInput],
        pagination: {
          totalItems: 1,
          page: GET_LIST_DEFAULT_PAGE,
          totalPages: 1,
          limit: GET_LIST_DEFAULT_LIMIT
        }
      });
    });
  });

  describe('#Get one campaign by id', () => {
    it('should call get detail successfully', async () => {
      campaignRepository.getOne = jest
        .fn()
        .mockResolvedValueOnce(campaignInput);
      const result = await campaignService.getOne({}, {});

      expect(campaignRepository.getOne).toHaveBeenCalledWith({}, {});
      expect(result).toEqual(campaignInput);
    });
    it('should call get detail fail', async () => {
      campaignRepository.getOne = jest.fn().mockResolvedValueOnce(null);
      const error = await campaignService.getOne({}, {}).catch(e => e);

      expect(campaignRepository.getOne).toHaveBeenCalledWith({}, {});
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('#Get campaign', () => {
    it('should call get detail successfully', async () => {
      campaignRepository.getById = jest
        .fn()
        .mockResolvedValueOnce(campaignInput);
      const result = await campaignService.getById('123');

      expect(campaignRepository.getById).toHaveBeenCalledWith('123');
      expect(result).toEqual(campaignInput);
    });
    it('should call get detail with type PROFILE_COMPLETION successfully', async () => {
      campaignRepository.getById = jest
        .fn()
        .mockResolvedValueOnce(campaignProfileCompletionInput);
      const result = await campaignService.getById('123');

      expect(campaignRepository.getById).toHaveBeenCalledWith('123');
      expect(result).toEqual(campaignProfileCompletionInput);
    });
    it('should call get detail fail', async () => {
      campaignRepository.getById = jest.fn().mockResolvedValueOnce(null);
      const error = await campaignService.getById('123').catch(e => e);

      expect(campaignRepository.getById).toHaveBeenCalledWith('123');
      expect(error).toBeInstanceOf(AppError);
    });
    it('should call get fail if campaignId undefined', async () => {
      let campaignId;
      campaignService.getCampaignWithFormatedRuleIds = jest
        .fn()
        .mockResolvedValue(new AppError(ERROR_CODE.CAMPAIGN_NOT_FOUND));

      const error = await campaignService
        .getCampaignWithFormatedRuleIds(campaignId, campaignInput.rules)
        .catch(e => e);

      expect(
        campaignService.getCampaignWithFormatedRuleIds
      ).toHaveBeenCalledWith(campaignId, campaignInput.rules);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('#update campaign by id', () => {
    it('should call repo and return data', async () => {
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected]);
      campaignRepository.getListWithoutPaginate = jest
        .fn()
        .mockResolvedValueOnce([]);
      campaignsUtil.getRuleListFromPayload = jest
        .fn()
        .mockReturnValue(['60f844d027af5dc14d85a660']);
      campaignRepository.findOneAndUpdateById = jest
        .fn()
        .mockResolvedValueOnce({
          ...campaignInput,
          save: jest.fn().mockReturnValue(campaignInput)
        });

      const result = await campaignService.updateById('123', campaignInput);

      expect(campaignRepository.findOneAndUpdateById).toHaveBeenCalled();
      expect(result).toEqual(campaignInput);
    });

    it('should call repo when updating campaign with type PROFILE_COMPLETION and return data', async () => {
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginProfileCompletionExpected]);
      campaignRepository.getListWithoutPaginate = jest
        .fn()
        .mockResolvedValueOnce([]);
      campaignsUtil.getRuleListFromPayload = jest
        .fn()
        .mockReturnValue(['60f844d027af5dc14d85a660']);
      campaignRepository.findOneAndUpdateById = jest
        .fn()
        .mockResolvedValueOnce({
          ...campaignProfileCompletionInput,
          save: jest.fn().mockReturnValue(campaignProfileCompletionInput)
        });

      const result = await campaignService.updateById(
        '123',
        campaignProfileCompletionInput
      );

      expect(campaignRepository.findOneAndUpdateById).toHaveBeenCalled();
      expect(result).toEqual(campaignProfileCompletionInput);
    });

    it('should call update fail if date invalid', async () => {
      campaignRepository.findOneAndUpdateById = jest
        .fn()
        .mockResolvedValueOnce(null);
      const error = await campaignService
        .updateById('123', campaignInputInvalid)
        .catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should throw AppError if no update', async () => {
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected]);
      campaignRepository.getListWithoutPaginate = jest
        .fn()
        .mockResolvedValueOnce([]);
      campaignsUtil.getRuleListFromPayload = jest
        .fn()
        .mockReturnValue(['60f844d027af5dc14d85a660']);
      campaignRepository.findOneAndUpdateById = jest
        .fn()
        .mockResolvedValueOnce(null);
      const error = await campaignService
        .updateById('123', campaignInputInvalid)
        .catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('#call rundeck to import job', () => {
    it('should call import job if campaign has type = ScheduledEventType', async () => {
      // given
      campaignRepository.create = jest
        .fn()
        .mockResolvedValueOnce(campaignExpected);
      const campaign = await campaignRepository.create(campaignExpected);
      // then
      (importJob as jest.Mock).mockResolvedValueOnce('');
      await campaignService.callRundeckToRegister(campaign);
      expect(importJob).toHaveBeenCalled();
    });
  });

  describe('#trigger run campaign', () => {
    it('should call produce Perform Schedule Campaign', async () => {
      // given
      campaignProducer.producePerformScheduleCampaign = jest
        .fn()
        .mockImplementationOnce(() => {});
      //then
      await campaignService.triggerRunCampaign(
        'programId',
        awardsData,
        'campaignName',
        ScheduledEventType.BIRTHMONTH,
        conditionsMessage
      );
      expect(
        campaignProducer.producePerformScheduleCampaign
      ).toHaveBeenCalled();
    });
  });

  describe('#get for rundeck', () => {
    it('should call getForRunDeck success ', async () => {
      campaignRepository.getById = jest
        .fn()
        .mockResolvedValueOnce(campaignInput);
      ruleEngineService.getById = jest
        .fn()
        .mockResolvedValueOnce(ruleEnginExpected);
      campaignProducer.producePerformScheduleCampaign = jest
        .fn()
        .mockImplementationOnce(() => {});
      await campaignService.getForRunDeck('61dff3128e2db0523d327ed1');
      expect(
        campaignProducer.producePerformScheduleCampaign
      ).toHaveBeenCalled();
    });
    it('should call getForRunDeck fail if campaign not found ', async () => {
      // given
      campaignService.getForRunDeck = jest
        .fn()
        .mockResolvedValueOnce(new AppError(ERROR_CODE.NOT_FOUND));
      //then
      const error = await campaignService.getForRunDeck(
        '61dff3128e2db0523d327ed1'
      );

      expect(error).toBeInstanceOf(AppError);
    });
  });
});
