import {
  DEFAULT_USER_EMAIL,
  DEFAULT_USER_ID,
  HEADER_AUTH_USER_EMAIL,
  HEADER_AUTH_USER_FULLNAME,
  HEADER_AUTH_USER_ID
} from './constant';
import { IUserData } from './interface';

const getHeaderUserData = (header: Record<string, string>): IUserData => {
  const data: IUserData = {
    userId: header[HEADER_AUTH_USER_ID] || DEFAULT_USER_ID,
    fullName: header[HEADER_AUTH_USER_FULLNAME] || '',
    email: header[HEADER_AUTH_USER_EMAIL] || DEFAULT_USER_EMAIL
  };
  return data;
};

const commonUtil = {
  getHeaderUserData
};
export default commonUtil;
