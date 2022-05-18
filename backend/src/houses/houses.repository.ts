import { IHouse } from './houses.interface';
import { HouseDocument, HouseModel } from './houses.model';

const create = async (domain: IHouse): Promise<HouseDocument> => {
  const campaign = await HouseModel.create(domain);
  return campaign.execPopulate();
};

const getById = async (id: string): Promise<HouseDocument | null> => {
  return HouseModel.findById(id).exec();
};

const getPlainById = async (id: string): Promise<IHouse | null> => {
  return HouseModel.findById(id)
    .lean()
    .exec();
};

const findOneAndUpdateById = async (
  id: string,
  dataToUpdate: Partial<IHouse>,
  isForceCreate: boolean = false
): Promise<HouseDocument | null> => {
  return HouseModel.findOneAndUpdate({ _id: id }, dataToUpdate, {
    upsert: isForceCreate,
    new: true
  });
};
const updateMany = async (
  condition: Record<string, unknown>,
  updated: Record<string, unknown>
): Promise<void> => {
  await HouseModel.updateMany(condition, updated);
};

const deleteOne = async (id: string): Promise<boolean> => {
  const result = await HouseModel.deleteOne({ _id: id });
  return !!result.ok && !!result.n && result.n > 0;
};

const houseRepository = {
  create,
  getById,
  getPlainById,
  findOneAndUpdateById,
  deleteOne,
  updateMany
};

export default houseRepository;
