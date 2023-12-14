import { lazy } from 'react';

import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import ShopLoginPage from '../src/pages/shops/ShopLoginPage';
import DashboardLayout from './layouts/dashboard';
import ShopLayouts from './layouts/shopLayouts';
import SimpleLayout from './layouts/simple';
import DashboardAppPage from './pages/Admin/Dashboard/Dashboard';
import LoginPage from './pages/Admin/Login/LoginPage';

import ViewBookingDetails from './pages/Admin/Users/Usermanagement';
import Page404 from './pages/Page404';
import Dishes from './pages/shops/dishes/Dishes';
import Timeslot from './pages/shops/Timeslots/Timeslot';
import Orderhistory from './pages/Admin/Order history/Orderhistory';

const Offers = lazy(() => import('./pages/Admin/Offers/Offers'))

const Home = lazy(() => import('./pages/shops/home/Home'))
const MasterDishes = lazy(() => import('./pages/shops/dishes/MasterDishes'))
const OfferManagement = lazy(() => import('./pages/shops/Offers/Offer'))


const Restaurantdetails = lazy(() => import('./pages/Admin/Restaurant/RestaurantDetails'));
const Masterdish = lazy(() => import('./pages/Admin/Masterdish/Masterdish'))
const TableManagement = lazy(() => import('./pages/Admin/Table/Table'))

// ----------------------------------------------------------------------

export default function Router() {
  const isAuthenticated = !!localStorage.getItem('AccessToken');
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,

      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'users', element: <ViewBookingDetails /> },
        { path: 'restaurants', element: <Restaurantdetails /> },
        { path: 'masterdish', element: <Masterdish /> },
        { path: 'table', element: <TableManagement /> },
        { path: "offers", element: <Offers /> },
        {path:"orderHistory", element : <Orderhistory/>}


      ],
    },
    {
      path: 'login',
      element: !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />,
    },
    { path: 'shopLogin', element: <ShopLoginPage /> },

    {
      path: '/shopsDashboard',
      element: <ShopLayouts />,
      children: [
        { path: 'home', element: <Home /> },
        {
          path: "MasterDishes",
          children: [
            { path: "", element: <MasterDishes /> },
            { path: "dishes", element: <Dishes /> },
          ],
        },

        { path: 'offers', element: <OfferManagement /> },
        { path: 'timeslot', element: <Timeslot /> },



      ]
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
