// import { ObjectId } from 'mongoose';
import { AppError } from '../common/error/AppError';
import { ERROR_CODE } from '../common/errors';
import { IHouse } from './houses.interface';
import { HouseDocument } from './houses.model';
import houseRepository from './houses.repository';

const getById = async (id: string): Promise<HouseDocument> => {
  const data = await houseRepository.getById(id);
  if (!data) {
    throw new AppError(ERROR_CODE.NOT_FOUND);
  }
  return data;
};

const create = async (data: IHouse): Promise<HouseDocument> => {
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
  const house = await houseRepository.create(data);
  return house;
};

const updateById = async (
  id: string,
  data: IHouse
): Promise<HouseDocument> => {
  let house = await houseRepository.findOneAndUpdateById(id, data);
  if (!house) {
    throw new AppError(ERROR_CODE.HAVE_NO_UPDATED);
  }
  // house = await house.save();
  return house;
};

const campaignService = {
  getById,
  create,
  updateById
};

export default campaignService;
