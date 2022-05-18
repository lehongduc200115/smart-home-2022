import * as HapiSwagger from 'hapi-swagger';
import * as Package from '../../package.json';
import config from '../config';

const swaggerOptions: HapiSwagger.RegisterOptions = {
  info: {
    title: config.serviceName,
    version: Package.version
  },
  grouping: 'tags',
  securityDefinitions: {
    // jwt: {
    //   type: 'apiKey',
    //   name: 'Authorization',
    //   in: 'header'
    // },
    // apiKey: {
    //   type: 'apiKey',
    //   name: 'x-api-key',
    //   in: 'header'
    // }
  },
  // security: [{ jwt: [], apiKey: [] }],
  pathReplacements: [
    {
      replaceIn: 'endpoints',
      pattern: /\//,
      replacement: config.SWAGGER_BASE_PATH
    }
  ]
};

export default {
  plugin: HapiSwagger,
  options: swaggerOptions
};
