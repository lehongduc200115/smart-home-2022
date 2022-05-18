import mongoose, { Document, Model, Schema } from 'mongoose';
import { Status } from '../common/enum';
import constant from './lightRecords.constant';
import { ILightRecord } from './lightRecords.interface';

export type LightRecordDocument = ILightRecord & Document;

const lightRecordSchema: Schema<LightRecordDocument> = new Schema(
  {
    recordId: {
      type: String,
      required: true,
      index: true
    },
    recordTime: {
      type: Date,
      required: true,
    },
    value: {
      type: String,
      required: true
    },
    houseId: {
      type: String,
      required: true
    },
    status: {
      type: Status,
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

export const LightRecordModel: Model<LightRecordDocument> = mongoose.model(
  constant.MODEL_NAME,
  lightRecordSchema,
  constant.MODEL_NAME
);
