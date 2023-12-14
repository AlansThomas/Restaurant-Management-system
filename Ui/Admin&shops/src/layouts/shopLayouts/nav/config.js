// component
import SvgColor from '../../../components/svg-color';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/shopsDashboard/home',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Dish Management',
    path: '/shopsDashboard/MasterDishes',
    icon: icon('ic_cart'),

  },
  {
    title: 'Offer Management',
    path: '/shopsDashboard/offers',
    icon: icon('ic_cart'),

  },
  {
    title: 'Timeslot Management',
    path: '/shopsDashboard/timeslot',
    icon: <AccessTimeIcon/>

  },
];

export default navConfig;
