import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  GET_LIST_DEFAULT_LIMIT,
  GET_LIST_DEFAULT_PAGE,
  GET_LIST_DEFAULT_SORT_TYPE
} from '../../common/constant';
import { SortFieldEnum } from '../../common/enum';
import { IPaginationParams } from '../../common/interface';
import { CampaignModel } from '../campaigns.model';
import campaignRepository from '../campaigns.repository';
import { campaignInput } from './__mocks__/campaigns.data';

jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  return new mongoose.Mongoose(); // new mongoose instance and connection for each test
});

describe('campaigns.repository', () => {
  let mongod: MongoMemoryServer;
  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    await mongod.start();
    const mongoDbUri = await mongod.getUri();
    await mongoose.connect(mongoDbUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  });

  afterEach(async () => {
    expect.hasAssertions();
    jest.clearAllMocks();
    await CampaignModel.deleteMany({});
  });

  afterAll(async () => {
    await mongod.stop();
    await mongoose.connection.close();
  });

  describe('#create campaign', () => {
    it('should create a new domain resource', async () => {
      const response = await campaignRepository.create(campaignInput);

      expect(response).toBeDefined();
    });
  });

  describe('#campaign getList', () => {
    it('should get list of campaign', async () => {
      await CampaignModel.create(campaignInput);
      const pagination: IPaginationParams = {
        limit: GET_LIST_DEFAULT_LIMIT,
        page: GET_LIST_DEFAULT_PAGE,
        sortField: SortFieldEnum.UPDATED_AT,
        sortType: GET_LIST_DEFAULT_SORT_TYPE,
        offset: GET_LIST_DEFAULT_LIMIT * GET_LIST_DEFAULT_PAGE
      };
      const response = await campaignRepository.getList({}, pagination);
      expect(response).toHaveLength(1);
    });
  });
  describe('#campaign getOne', () => {
    it('should get the first campaign with conditions', async () => {
      const rule = await CampaignModel.create(campaignInput);
      const response = await campaignRepository.getOne({ _id: rule._id });
      expect(response).toBeDefined();
    });
  });

  describe('#campaign getListWithoutPaginate', () => {
    it('should get list of campaign', async () => {
      await CampaignModel.create(campaignInput);
      const response = await campaignRepository.getListWithoutPaginate({});
      expect(response).toHaveLength(1);
    });
  });
  describe('#countByParameter', () => {
    it('should get count rule with conditions', async () => {
      await CampaignModel.create(campaignInput);
      const response = await campaignRepository.countByParameter({});
      expect(response).toEqual(1);
    });
  });
  describe('#campaign getById', () => {
    it('should get the first campaign with conditions', async () => {
      const rule = await CampaignModel.create(campaignInput);
      const response = await campaignRepository.getById(rule._id);
      expect(response).toBeDefined();
    });
  });

  describe('#campaign getPlainById', () => {
    it('should get the first campaign with conditions', async () => {
      const rule = await CampaignModel.create(campaignInput);
      const response = await campaignRepository.getPlainById(rule._id);
      expect(response).toBeDefined();
    });
  });

  describe('#campaign findOneAndUpdateById', () => {
    it('should update campaign', async () => {
      const rule = await CampaignModel.create(campaignInput);

      const updateRule = await campaignRepository.findOneAndUpdateById(
        rule._id,
        {
          name: 'test1'
        }
      );
      expect(updateRule).toBeDefined();
      expect(updateRule?.name).toEqual('test1');
    });
  });

  describe('#campaign updateMany', () => {
    it('should update campaign', async () => {
      const rule = await CampaignModel.create(campaignInput);

      await campaignRepository.updateMany(
        {
          _id: { $in: [rule._id] }
        },
        { $inc: { priority: 1 } }
      );

      const result = await CampaignModel.findById(rule._id);
      expect(result?.name).toEqual(campaignInput.name);
      expect(result?.priority).toEqual(campaignInput.priority + 1);
    });
  });

  describe('#campaign deleteOne', () => {
    it('should delete campaign', async () => {
      const rule = await CampaignModel.create(campaignInput);
      const response = await campaignRepository.deleteOne(rule._id);
      expect(response).toEqual(true);
    });
  });
});
