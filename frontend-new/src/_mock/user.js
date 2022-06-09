import { faker } from '@faker-js/faker';
import { random, sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  // avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  name: index+1,
  company: random(1,4),
  isVerified: faker.datatype.boolean(),
  status: sample(['on', 'off']),
  role: sample([
    'Đèn hỏng',
    'Đèn sẽ được sửa chữa vào thứ 5',
    'Đèn hoạt động bình thường',
    // 'UI Designer',
    // 'UX Designer',
    // 'UI/UX Designer',
    // 'Project Manager',
    // 'Backend Developer',
    // 'Full Stack Designer',
    // 'Front End Developer',
    // 'Full Stack Developer',
  ]),
}));

export default users;
