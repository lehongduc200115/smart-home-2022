// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Điều khiển',
    path: '/dashboard/control',
    icon: getIcon('eva:alert-triangle-fill'),
  },
  {
    title: 'Xem thống kê',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Xem trạng thái',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Xem và đặt lịch',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  // {
  //   title: 'Về chúng tôi',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  // {
  //   title: 'Đăng nhập',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'Đăng ký',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
];

export default navConfig;
