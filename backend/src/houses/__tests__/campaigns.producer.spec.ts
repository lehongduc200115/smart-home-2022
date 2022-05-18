import campaignsProducer from '../../campaigns/campaigns.producer';
import { Status } from '../../common/enum';
import { KafkaTopics } from '../../common/kafka/kafkaTopics';
import producer from '../../common/kafkaProducer';
import { ScheduledEventType } from '../campaigns.enum';
import {
  awardsData,
  campaignInput,
  conditionsMessage
} from './__mocks__/campaigns.data';
jest.mock('uuid', () => ({
  v4: () => 'uuidv4'
}));

jest.mock('../../common/kafkaProducer');

describe('campaignsProducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    expect.hasAssertions();
    jest.resetAllMocks();
  });

  it('should produce TOPIC to kafka when call produceCampaignReward', async () => {
    const topic = KafkaTopics.TOPIC_CAMPAIGN_REWARD;

    const serializedMessage = {
      topic,
      messages: [
        {
          value: {
            campaignId: '1234567',
            campaignName: 'Campaign',
            status: Status.ACTIVE,
            rewards: ['12345565']
          }
        }
      ]
    };

    producer.sendSerializedValue = jest.fn();

    await campaignsProducer.produceCampaignReward(
      ['12345565'],
      '1234567',
      'Campaign',
      Status.ACTIVE
    );

    expect(producer.sendSerializedValue).toBeCalledWith(serializedMessage);
  });

  it('should produce TOPIC to kafka when call producePerformScheduleCampaign', async () => {
    const executeDate = '2022-12-11T07:46:01.862Z';
    const topic = KafkaTopics.TOPIC_PERFORM_SCHEDULED_CAMPAIGN;
    const serializedMessage = {
      topic,
      messages: [
        {
          value: {
            activityType: ScheduledEventType.BIRTHDAY,
            programId: 'programId',
            campaignName: campaignInput.name,
            conditions: {
              tierId: '617a11db01ac2e68772ca4e6',
              birthday: '20-12'
            },
            awards: [
              {
                transactionType: 'ISSUED',
                transactionCategory: 'POINT',
                type: 'FIXED',
                value: 1000
              },
              {
                transactionType: 'ISSUED',
                transactionCategory: 'REWARD',
                value: ['619e2b54e84a9d47666b1a3c', '619e2b54e84a9d47666b1a3e']
              }
            ]
          }
        }
      ]
    };

    producer.sendSerializedValue = jest.fn();

    await campaignsProducer.producePerformScheduleCampaign(
      campaignInput.programId,
      campaignInput.name,
      ScheduledEventType.BIRTHDAY,
      {
        tierId: '617a11db01ac2e68772ca4e6',
        birthday: '20-12'
      },
      awardsData
    );

    expect(producer.sendSerializedValue).toBeCalledWith(serializedMessage);
  });
});
