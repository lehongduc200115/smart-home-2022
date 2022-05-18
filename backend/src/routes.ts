import houseController from './houses/houses.controller';
import requestController from './requests/requests.controller';
import lightRecordController from './lightRecords/lightRecords.controller';

const routes = [
  ...houseController,
  ...requestController,
  ...lightRecordController
];

export { routes };
