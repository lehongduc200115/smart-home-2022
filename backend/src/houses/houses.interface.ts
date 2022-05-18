import { IMongoBase } from '@swat/hapi-common';
import { Status } from '../common/enum';
import { Request } from '@hapi/hapi';

export interface IHouse extends Partial<IMongoBase> {
  name: string;
  userId: string;
  description?: string;
  imgUrl?: string;
  location?: string; 
  status: Status;
  createdBy?: string;
  updatedBy?: string;
}

export interface IHousePayload {
  name: string;
  description?: string;
  imgUrl?: string;
  location?: string; 
  status: Status;
}

export interface IHouseRequest extends Request {
  payload: IHousePayload;
}

// export interface ICampaignFilter {
//   pointType?: PointType;
//   status?: Status;
//   programId?: string;
//   startDate?: string;
//   endDate?: string;
//   searchText?: string;
// }

// export interface ICampaignFilterRequest extends Request {
//   query: ICampaignFilter;
// }
