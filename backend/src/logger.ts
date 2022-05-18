import { BaseLogWrapper, createLogger, Tracing } from '@swat/hapi-common';
import { name } from '../package.json';

const logger = createLogger({
  defaultMeta: {
    service: name
  },
  tracing: {
    tracerSessionName: Tracing.TRACER_SESSION,
    requestId: Tracing.TRANSACTION_ID
  }
});

export const wrapLogs = new BaseLogWrapper(logger).getWrapper();
export default logger;
