import Hapi from '@hapi/hapi';
import { HttpHeaders, HttpResponse, Tracing } from '@swat/hapi-common';
import { getNamespace } from 'cls-hooked';
import _ from 'lodash';
import { AppError } from '../common/error/AppError';
import config from '../config';
import logger from '../logger';

const documentPathRegex = /^\/documentation/;
const swaggerPathRegex = /^\/swagger/;
const hapiSwaggerPath = config.SWAGGER_BASE_PATH;
const cors = config.server.cors;

const handleHapiResponse = (
  hapiRequest: Hapi.Request,
  hapiResponse: Hapi.ResponseToolkit
) => {
  // ignore document ui path
  if (documentPathRegex.test(hapiRequest.url.pathname)) {
    const hapiSwaggerContext = {
      context: {
        hapiSwagger: {
          jsonPath: `${hapiSwaggerPath}swagger.json`,
          swaggerUIPath: `${hapiSwaggerPath}swaggerui/`
        }
      }
    };

    _.merge(hapiResponse.request.response, { source: hapiSwaggerContext });
    return hapiResponse.continue;
  }

  if (swaggerPathRegex.test(hapiRequest.url.pathname)) {
    return hapiResponse.continue;
  }

  const httpResponse = new HttpResponse<any>();
  let errorMessage = '',
    errorCode = '',
    errorDetails;

  const responseData = hapiResponse.request.response;

  if (responseData instanceof Error) {
    errorMessage = responseData.output.payload.message;
    errorCode = responseData.output.payload.error;
    // parse raw error not coming from server handler, ex: joi validation
    if (!responseData.isServer) {
      httpResponse.fail(
        {
          message: responseData.output.payload.message,
          code: responseData.output.payload.statusCode
        },
        responseData.output.statusCode
      );
    }

    logger.error(responseData.message, responseData);

    if (responseData instanceof AppError) {
      const errors = responseData.getErrors();
      errorMessage = errors.message;
      errorCode = responseData.errorCode.toString();
      errorDetails = errors.errors;
      httpResponse.fail(
        {
          message: errors.message,
          code: errors.code,
          errors: errors.errors
        },
        errors.statusCode,
        errors.additionalData
      );
    } else {
      httpResponse.fail(
        {
          message: responseData.output.payload.message,
          code: responseData.output.payload.statusCode
        },
        responseData.output.statusCode
      );
    }
  } else {
    httpResponse.success(responseData.source, responseData.statusCode);
  }

  let response = hapiResponse
    .response(httpResponse.getBody())
    .code(httpResponse.getStatusCode());

  Object.keys(cors).forEach((key: string) => {
    response.headers[key] = cors[key];
  });

  // setting errorMessage & errorCode for logger with hapi-pino
  errorMessage && response.header(HttpHeaders.X_ERROR_MESSAGE, errorMessage);
  errorCode && response.header(HttpHeaders.X_ERROR_CODE, errorCode);
  errorDetails &&
    errorDetails.length &&
    response.header(HttpHeaders.X_ERROR_LIST, JSON.stringify(errorDetails));

  const tracerSession = getNamespace(Tracing.TRACER_SESSION);
  if (tracerSession) {
    const transactionId = tracerSession.get(Tracing.TRANSACTION_ID);
    response.header(Tracing.TRANSACTION_ID, transactionId);
  }

  return response;
};

const responseWrapper: Hapi.Plugin<{}> = {
  name: 'responseWrapper',
  version: '1.0.0',
  register: (server: Hapi.Server) => {
    server.ext('onPreResponse', handleHapiResponse);
  },
  once: true
};

export default responseWrapper;
