import { consumer, Kafka } from '@swat/hapi-common';
import { get } from 'lodash';
// import activityConsumerService from '../activities/activities.consumer';
import config from '../config';

const kconsumer = consumer.init({
  groupId: Kafka.CONSUMER_GROUP,
  clientId: config.serviceName,
  brokers: config.kafkaBrokers
});

const connect = async () => {
  const partitionsConsumedConcurrently = get(
    config,
    'kafka.partitionsConsumedConcurrently',
    undefined
  );
  consumer.connectSubscribeRun(
    kconsumer,
    {
      // ...activityConsumerService.topicsMap
    },
    partitionsConsumedConcurrently
      ? parseInt(partitionsConsumedConcurrently)
      : undefined
  );
};

const kafka = {
  connect
};

export default kafka;
