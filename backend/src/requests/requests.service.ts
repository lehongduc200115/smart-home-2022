// import { ObjectId } from 'mongoose';
import { AppError } from '../common/error/AppError';
import { ERROR_CODE } from '../common/errors';
import { IRequest } from './requests.interface';
import { RequestDocument } from './requests.model';
import requestRepository from './requests.repository';

const getById = async (id: string): Promise<RequestDocument> => {
  const data = await requestRepository.getById(id);
  if (!data) {
    throw new AppError(ERROR_CODE.NOT_FOUND);
  }
  return data;
};

const create = async (data: IRequest): Promise<RequestDocument> => {
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
  const request = await requestRepository.create(data);
  return request;
};

const updateById = async (
  id: string,
  data: IRequest
): Promise<RequestDocument> => {
  let request = await requestRepository.findOneAndUpdateById(id, data);
  if (!request) {
    throw new AppError(ERROR_CODE.HAVE_NO_UPDATED);
  }
  // request = await request.save();
  return request;
};

const campaignService = {
  getById,
  create,
  updateById
};

export default campaignService;
