import { IRequest } from './requests.interface';
import { RequestDocument, RequestModel } from './requests.model';

const create = async (domain: IRequest): Promise<RequestDocument> => {
  const campaign = await RequestModel.create(domain);
  return campaign.execPopulate();
};

const getById = async (id: string): Promise<RequestDocument | null> => {
  return RequestModel.findById(id).exec();
};

const getPlainById = async (id: string): Promise<IRequest | null> => {
  return RequestModel.findById(id)
    .lean()
    .exec();
};

const findOneAndUpdateById = async (
  id: string,
  dataToUpdate: Partial<IRequest>,
  isForceCreate: boolean = false
): Promise<RequestDocument | null> => {
  return RequestModel.findOneAndUpdate({ _id: id }, dataToUpdate, {
    upsert: isForceCreate,
    new: true
  });
};
const updateMany = async (
  condition: Record<string, unknown>,
  updated: Record<string, unknown>
): Promise<void> => {
  await RequestModel.updateMany(condition, updated);
};

const deleteOne = async (id: string): Promise<boolean> => {
  const result = await RequestModel.deleteOne({ _id: id });
  return !!result.ok && !!result.n && result.n > 0;
};

const requestRepository = {
  create,
  getById,
  getPlainById,
  findOneAndUpdateById,
  deleteOne,
  updateMany
};

export default requestRepository;
