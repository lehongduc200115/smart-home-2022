import { IMongoBase } from '@swat/hapi-common';
import { Status } from '../common/enum';
import { Request } from '@hapi/hapi';

export interface ILightRecord extends Partial<IMongoBase> {
  recordId: string;
  houseId: string;
  recordTime: Date;
  value: string;
  status: Status;
  createdBy?: string;
  updatedBy?: string;
}

export interface ILightRecordPayload {
  recordId: string;
  houseId: string;
  recordTime: Date;
  value: string;
  status: Status;
}

export interface ILightRecordRequest extends Request {
  payload: ILightRecordPayload;
}