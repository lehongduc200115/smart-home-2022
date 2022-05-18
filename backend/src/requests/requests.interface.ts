import { IMongoBase } from '@swat/hapi-common';
import { Status } from '../common/enum';
import { Request } from '@hapi/hapi';
import { RequestStatus, RequestType } from './requests.enum';

export interface IRequest extends Partial<IMongoBase> {
  userId: string;
  houseId: string;
  requestType: RequestType;
  requestStatus: RequestStatus;
  status: Status;
  createdBy?: string;
  updatedBy?: string;
}

export interface IRequestPayload {
  houseId: string;
  requestType: RequestType;
  requestStatus: RequestStatus;
  status: Status;
}

export interface IRequestRequest extends Request {
  payload: IRequestPayload;
}