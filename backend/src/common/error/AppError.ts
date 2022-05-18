import { ERROR_CODE, ErrorList } from '../errors';
import { AdditionalData, IErrorDetails } from '../interface';

export class AppError extends Error {
  public additionalData?: AdditionalData;
  public errorCode: ERROR_CODE;
  errors?: IErrorDetails[];
  constructor(
    errorCode: ERROR_CODE,
    errors?: IErrorDetails[],
    additionalData?: AdditionalData
  ) {
    super(errorCode);
    this.errorCode = errorCode;
    this.name = AppError.name;
    this.errors = errors;
    this.additionalData = additionalData;
  }

  getErrors() {
    const error = ErrorList[this.errorCode];
    return {
      errors: this.errors,
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
      additionalData: this.additionalData
    };
  }
}

export const createErrorDetail = (
  key: string,
  errorCode: ERROR_CODE
): IErrorDetails => {
  return {
    key,
    code: errorCode,
    message: ErrorList[errorCode].message
  };
};
