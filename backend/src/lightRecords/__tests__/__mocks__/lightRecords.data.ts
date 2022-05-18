import {
  GET_LIST_DEFAULT_LIMIT,
  GET_LIST_DEFAULT_PAGE
} from '../../../common/constant';
import {
  SortFieldEnum,
  SortTypeEnum,
  Status
} from '../../../common/enum';

export const conditionsMessage = {
  tierId: '617a11db01ac2e68772ca4e6',
  birthday: '20-12'
};

export const campaignQuery = {
  // pointType: PointType.FIXED,
  status: Status.ACTIVE,
  startDate: '2021-10-18',
  endDate: '2021-10-18',
  searchText: 'test',
  limit: GET_LIST_DEFAULT_LIMIT,
  page: GET_LIST_DEFAULT_PAGE,
  sortField: SortFieldEnum.UPDATED_AT,
  sortType: SortTypeEnum.ASCENDING
};

export const campaignWithFormatedRuleIdsExpected: any = {
  compiledRule: {
    all: [
      {
        rule: {
          compiledRule: {
            any: [
              {
                operator: 'equal',
                value: 'SALES_TRANSACTION',
                fact: 'activityType'
              }
            ]
          }
        }
      }
    ]
  }
};

export const responseExample = {
  _id: '61db95df9ffe0e2ef6f0eb68',
  houseId: '61db95df9ffe0e2ef6f0eb68',
  recordId: '61db95df9ffe0e2ef6f0eb68',
  recordTime: '2016-06-03T23:15:33.008Z',
  value: '100',
  status: 'ACTIVE',
  createdBy: 'admin@hcmut.edu.vn',
  updatedBy: 'admin@hcmut.edu.vn',
  createdAt: '2022-01-10T02:11:43.892Z',
  updatedAt: '2022-01-10T02:11:43.892Z'
};

export const createRequestExample = {
  houseId: '61db95df9ffe0e2ef6f0eb68',
  recordId: '61db95df9ffe0e2ef6f0eb69',
  recordTime: '2016-06-03T23:15:33.008Z',
  value: '100',
  status: 'ACTIVE',
};