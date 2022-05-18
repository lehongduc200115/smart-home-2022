import config from '../../config';
import Redis from 'ioredis';

const redis = new Redis(config.redisUri);

export default redis;
