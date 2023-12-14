// component
import SvgColor from '../../../components/svg-color';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalDiningIcon from '@mui/icons-material/LocalDining'; 
import TableBarIcon from '@mui/icons-material/TableBar';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HistoryIcon from '@mui/icons-material/History';
// --------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: <DashboardIcon />,
  },
  {
    title: 'User Management',
    path: '/dashboard/users',
    icon: icon('ic_user'),
    
  },
  {
    title: 'Restaurant Management',
    path: '/dashboard/restaurants',
    icon: icon('ic_cart'),
  },
  {
    title: 'Masterdish Management',
    path: '/dashboard/masterdish',
    icon: <LocalDiningIcon/>,
  },
  {
    title: 'Table Management',
    path: '/dashboard/table',
    icon: <TableBarIcon/>,
  },
  {
    title: 'Offer Management',
    path: '/dashboard/offers',
    icon: <CardGiftcardIcon/>,
  },
  {
    title: 'Order History',
    path: '/dashboard/orderHistory',
    icon: <HistoryIcon/>,
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
