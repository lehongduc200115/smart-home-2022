import { ILightRecord } from './lightRecords.interface';
import { LightRecordDocument, LightRecordModel } from './lightRecords.model';

const create = async (domain: ILightRecord): Promise<LightRecordDocument> => {
  const campaign = await LightRecordModel.create(domain);
  return campaign.execPopulate();
};

const getById = async (id: string): Promise<LightRecordDocument | null> => {
  return LightRecordModel.findById(id).exec();
};

const getPlainById = async (id: string): Promise<ILightRecord | null> => {
  return LightRecordModel.findById(id)
    .lean()
    .exec();
};

const findOneAndUpdateById = async (
  id: string,
  dataToUpdate: Partial<ILightRecord>,
  isForceCreate: boolean = false
): Promise<LightRecordDocument | null> => {
  return LightRecordModel.findOneAndUpdate({ _id: id }, dataToUpdate, {
    upsert: isForceCreate,
    new: true
  });
};
const updateMany = async (
  condition: Record<string, unknown>,
  updated: Record<string, unknown>
): Promise<void> => {
  await LightRecordModel.updateMany(condition, updated);
};

const deleteOne = async (id: string): Promise<boolean> => {
  const result = await LightRecordModel.deleteOne({ _id: id });
  return !!result.ok && !!result.n && result.n > 0;
};

const lightRecordRepository = {
  create,
  getById,
  getPlainById,
  findOneAndUpdateById,
  deleteOne,
  updateMany
};

export default lightRecordRepository;
