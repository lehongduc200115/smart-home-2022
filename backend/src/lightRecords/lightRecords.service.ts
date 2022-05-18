// import { ObjectId } from 'mongoose';
import { AppError } from '../common/error/AppError';
import { ERROR_CODE } from '../common/errors';
import { ILightRecord } from './lightRecords.interface';
import { LightRecordDocument } from './lightRecords.model';
import lightRecordRepository from './lightRecords.repository';

const getById = async (id: string): Promise<LightRecordDocument> => {
  const data = await lightRecordRepository.getById(id);
  if (!data) {
    throw new AppError(ERROR_CODE.NOT_FOUND);
  }
  return data;
};

const create = async (data: ILightRecord): Promise<LightRecordDocument> => {
  // const user = await userRepository.getById(data.userId);
  // if (!user) {
  //   throw new AppError(ERROR_CODE.INVALID_REQUEST, [
  //   {
  //     message: 'End Date cannot be set before Start Date.',
  //     key: 'rules',
  //     code: '1302002'
  //   }
  // ])
  // }
  const lightRecord = await lightRecordRepository.create(data);
  return lightRecord;
};

const updateById = async (
  id: string,
  data: ILightRecord
): Promise<LightRecordDocument> => {
  let lightRecord = await lightRecordRepository.findOneAndUpdateById(id, data);
  if (!lightRecord) {
    throw new AppError(ERROR_CODE.HAVE_NO_UPDATED);
  }
  // lightRecord = await lightRecord.save();
  return lightRecord;
};

const campaignService = {
  getById,
  create,
  updateById
};

export default campaignService;
