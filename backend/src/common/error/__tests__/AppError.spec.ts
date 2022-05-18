import { AppError, createErrorDetail } from '../../error/AppError';
import { ErrorList, ERROR_CODE } from '../../errors';

describe('Error', () => {
  it('should implement AppError', () => {
    const appError = new AppError(ERROR_CODE.KAFKA_UNEXPECTED_ERROR, [
      {
        message: 'string',
        key: 'string',
        code: 'string'
      }
    ]);
    expect(appError.getErrors).toBeDefined();
  });

  it('should createErrorDetail', () => {
    const errorDetail = createErrorDetail('key', ERROR_CODE.NOT_FOUND);
    expect(errorDetail).toEqual({
      key: 'key',
      code: ERROR_CODE.NOT_FOUND,
      message: ErrorList[ERROR_CODE.NOT_FOUND].message
    });
  });
});
