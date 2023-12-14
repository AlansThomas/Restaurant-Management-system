import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import SocialShare from "./screens/SocialShare/SocialShare";

const UserProfile = lazy(() => import("./screens/users/userProfile/UserProfile"))
const MyOrders = lazy(() => import("./screens/order/orderHistory/MyOrders"))
const ShopMain = lazy(() => import("./screens/shop/ShopMain/ShopMain"))
const Order = lazy(() => import("./screens/order/orders/Order"))
const Dishes = lazy(() => import("./screens/Dishes/DIshes/Dishes"))
const Home = lazy(() => import("./components/langingPage/Home"))
const LandingPage = lazy(() => import("./components/langingPage/LandingPage"));
const Page404 = lazy(() => import("./utils/error/404/Page404"));


export default function Routes() {
    return (

        useRoutes([
            { path: '/', element: <Navigate to="/dashboard" /> },
            {
                path: "/dashboard",
                element: <Home />,

                children: [

                    { element: <Navigate to="/dashboard/home" />, index: true },
                    { path: "home", element: <LandingPage />, index: true },
                    { path: "socialshare", element: <SocialShare />, index: true },

                    { path: "Dishes", element: <Dishes />, index: true },
                    { path: "shops", element: <ShopMain />, index: true },
                    { path: 'order', element: <Order />, index: true },
                    { path: 'orderHistory', element: <MyOrders />, index: true },
                    { path: 'profile', element: <UserProfile />, index: true }

                ]
            },
            {
                path: '*',
                element: <Page404 replace />,
                index: true,
            },
        ])
    )
}

