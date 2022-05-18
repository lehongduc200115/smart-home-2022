import mongoose, { Document, Model, Schema } from 'mongoose';
import { Status } from '../common/enum';
import constant from './houses.constant';
import { IHouse } from './houses.interface';

export type HouseDocument = IHouse & Document;

const houseSchema: Schema<HouseDocument> = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    type: {
      type: String
    },
    description: {
      type: String
    },
    imgUrl: {
      type: String
    },
    location: {
      type: String
    },
    status: {
      type: Status,
      index: true,
      required: true
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

export const HouseModel: Model<HouseDocument> = mongoose.model(
  constant.MODEL_NAME,
  houseSchema,
  constant.MODEL_NAME
);
