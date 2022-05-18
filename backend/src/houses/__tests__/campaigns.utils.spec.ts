import { AppError } from '../../common/error/AppError';
import ruleEngineService from '../../ruleEngines/ruleEngines.service';
import { ruleEnginExpected } from '../../ruleEngines/__tests__/__mocks__/ruleEngines.data';
import { NormalEventType, RecurringEventType } from '../campaigns.enum';
import campaignsUtil from '../campaigns.util';

describe('campaignUtil', () => {
  afterEach(() => {
    jest.clearAllMocks();
    expect.hasAssertions();
  });

  describe('#pathFinder', () => {
    it('Should return result', async () => {
      const input = {
        all: [
          {
            operator: 'greaterThan',
            value: 1000,
            fact: 'totalAmount'
          },
          {
            all: [
              {
                operator: 'equal',
                value: 'SALES_TRANSACTION',
                fact: 'activityType'
              }
            ]
          }
        ]
      };
      const expected = [
        'all.operator',
        'all.value',
        'all.fact',
        'all.all.operator',
        'all.all.value',
        'all.all.fact'
      ];
      const result = campaignsUtil.pathFinder(input);
      expect(result).toEqual(expected);
    });
  });
  describe('#getRuleListFromPayload', () => {
    it('Should return rules if has rule', async () => {
      const result = campaignsUtil.getRuleListFromPayload([
        { rule: '60f844d027af5dc14d85a660' }
      ]);
      expect(result).toEqual(['60f844d027af5dc14d85a660']);
    });
  });

  describe('#validateRules', () => {
    it('Should throw error if rules are duplicated', async () => {
      const ruleIds = ['60f844d027af5dc14d85a660', '60f844d027af5dc14d85a660'];
      const error = await campaignsUtil
        .validateRules(ruleIds, NormalEventType.SALES_TRANSACTION)
        .catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });
    it('Should throw error if any rules cannot be found', async () => {
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected]);

      const ruleIds = ['60f844d027af5dc14d85a660', '60f844d027af5dc14d85a661'];
      const error = await campaignsUtil
        .validateRules(ruleIds, NormalEventType.SALES_TRANSACTION)
        .catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });
    it('Should throw error if any rules do not match campaign type', async () => {
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected]);

      const ruleIds = ['60f844d027af5dc14d85a660'];
      const error = await campaignsUtil
        .validateRules(ruleIds, NormalEventType.SALES_TRANSACTION)
        .catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });
    it('Should throw error if any rules do not match campaign with type Recurring', async () => {
      ruleEngineService.getListByRuleIds = jest
        .fn()
        .mockResolvedValueOnce([ruleEnginExpected]);

      const ruleIds = ['60f844d027af5dc14d85a660'];
      const error = await campaignsUtil
        .validateRules(ruleIds, RecurringEventType.RECURRING_EVENT)
        .catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });
    it('Should throw error if any recurring rules do not exist in campaign with type Recurring', async () => {
      ruleEngineService.getListByRuleIds = jest.fn().mockResolvedValueOnce([
        {
          ...ruleEnginExpected,
          campaignType: RecurringEventType.RECURRING_EVENT
        }
      ]);

      const ruleIds = ['60f844d027af5dc14d85a660'];
      const error = await campaignsUtil
        .validateRules(ruleIds, RecurringEventType.RECURRING_EVENT)
        .catch(e => e);
      expect(error).toBeInstanceOf(AppError);
    });
  });
});
