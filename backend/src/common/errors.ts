import { StatusCode } from '@swat/hapi-common';
import logger from '../logger';
import { AppError, createErrorDetail } from './error/AppError';
import { IErrorDetails } from './interface';

const MONGO_ERROR = 'MongoError';
enum MONGO_ERROR_CODE {
  DUPLICATED_KEY = 11000
}

enum ERROR_CODE {
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DUPLICATED_KEY = 'DUPLICATED_KEY',
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  KAFKA_UNEXPECTED_ERROR = 'KAFKA_UNEXPECTED_ERROR',
  INVALID_FIELD = 'INVALID_FIELD',
  HAVE_NO_UPDATED = 'HAVE_NO_UPDATED',
  CAMPAIGN_NOT_FOUND = 'CAMPAIGN_NOT_FOUND',
  RULE_NOT_FOUND = 'RULE_NOT_FOUND',
  INVALID_DATE = 'INVALID_DATE'
}

// customized error message for joi
const JoiValidationErrors = {
  required: ERROR_CODE.FIELD_REQUIRED
};

const ErrorList = {
  // Common Errors
  [ERROR_CODE.NOT_FOUND]: {
    statusCode: StatusCode.NOT_FOUND,
    message: 'Not Found',
    code: 1301001
  },
  [ERROR_CODE.CAMPAIGN_NOT_FOUND]: {
    statusCode: StatusCode.NOT_FOUND,
    message: 'Campaign Not Found',
    code: 1307004
  },
  [ERROR_CODE.RULE_NOT_FOUND]: {
    statusCode: StatusCode.NOT_FOUND,
    message: 'Rule Not Found',
    code: 1307003
  },
  [ERROR_CODE.CAMPAIGN_NOT_FOUND]: {
    statusCode: StatusCode.NOT_FOUND,
    message: 'Campaign Not Found',
    code: StatusCode.NOT_FOUND
  },
  [ERROR_CODE.RULE_NOT_FOUND]: {
    statusCode: StatusCode.NOT_FOUND,
    message: 'Rule Not Found',
    code: StatusCode.NOT_FOUND
  },
  [ERROR_CODE.INTERNAL_ERROR]: {
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    message: 'Internal Error',
    code: 1304005
  },
  [ERROR_CODE.INVALID_REQUEST]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Request format incorrect',
    code: 1302002
  },
  [ERROR_CODE.INVALID_FIELD]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'This field does not have the correct format.',
    code: 1302002
  },
  [ERROR_CODE.KAFKA_UNEXPECTED_ERROR]: {
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    message: 'Kafka Unexpected error initialized',
    code: 1304005
  },
  [ERROR_CODE.FIELD_REQUIRED]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'This field is required.',
    code: 1302002
  },
  [ERROR_CODE.DUPLICATED_KEY]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Key Mongo Id is Duplicated',
    code: 1302002
  },
  [ERROR_CODE.HAVE_NO_UPDATED]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Have no update was made',
    code: 1302002
  },
  [ERROR_CODE.RULE_NOT_FOUND]: {
    statusCode: StatusCode.NOT_FOUND,
    message: 'Rule Id is not found',
    code: 1307003
  },
  [ERROR_CODE.INVALID_DATE]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'End Date cannot be set before Start Date.',
    code: 1302002
  }
};

const errorTranslator = (error: any): any => {
  // handle MongoDB error
  if (
    error.name === MONGO_ERROR &&
    error.code === MONGO_ERROR_CODE.DUPLICATED_KEY
  ) {
    logger.error('Mongo error', error);

    let errorList: IErrorDetails[] = [];
    Object.keys((error as any).keyValue).forEach(key => {
      errorList.push(createErrorDetail(key, ERROR_CODE.DUPLICATED_KEY));
    });
    throw new AppError(ERROR_CODE.INVALID_REQUEST, errorList);
  }
  throw error;
};

export {
  ERROR_CODE,
  ErrorList,
  JoiValidationErrors,
  MONGO_ERROR,
  MONGO_ERROR_CODE,
  errorTranslator
};
