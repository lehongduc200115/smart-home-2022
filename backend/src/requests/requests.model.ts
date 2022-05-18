import mongoose, { Document, Model, Schema } from 'mongoose';
import { Status } from '../common/enum';
import constant from './requests.constant';
import { RequestStatus, RequestType } from './requests.enum';
import { IRequest } from './requests.interface';

export type RequestDocument = IRequest & Document;

const requestSchema: Schema<RequestDocument> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    houseId: {
      type: String,
      required: true,
      index: true
    },
    requestType: {
      type: RequestType,
      required: true
    },
    requestStatus: {
      type: RequestStatus,
      required: true
    },
    status: {
      type: Status,
      required: true,
      default: Status.ACTIVE,
    },
    createdBy: {
      type: String
    },
    updatedBy: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// campaignSchema.set('toObject', {
//   virtuals: true
// });

export const RequestModel: Model<RequestDocument> = mongoose.model(
  constant.MODEL_NAME,
  requestSchema,
  constant.MODEL_NAME
);
