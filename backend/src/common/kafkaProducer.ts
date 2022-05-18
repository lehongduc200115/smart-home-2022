import { producer } from '@swat/hapi-common';
import config from '../config';
const kafKaConfig = {
  clientId: config.serviceName,
  brokers: config.kafkaBrokers,
  idempotent: false
};

const kproducer = producer.init(kafKaConfig);

export default kproducer;
