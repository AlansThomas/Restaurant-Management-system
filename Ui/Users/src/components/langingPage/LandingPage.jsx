import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { getShops } from '../../services/apiConstants/apiServices';
import Shops from "../../screens/shop/shop/Shops"

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import landingPageStyles from "./landingPage.module.css"

export default function LandingPage() {
    const [res, setRes] = useState([])
    const value = ''


    const Resturants = () => {
        getShops(value)
            .then((response) => {
                response && setRes(response?.data?.shops);
                console.log(response?.data?.shops);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        Resturants();
    }, [])

    return (
        <div style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
            <Helmet>
                <title> Restaruant </title>
            </Helmet><div className={landingPageStyles.container}>
                <div className={`${landingPageStyles.carousel} z-0`}>
                    <img
                        src="/assets/foodImage3.avif"
                        alt="image 1"
                        className="h-full w-full object-cover" />
                    <img
                        src="/assets/foodImage1.jpg"
                        alt="image 2"
                        className="h-full w-full object-cover" />
                    <img
                        src="/assets/foodImage2.webp"
                        alt="image 3"
                        className="h-full w-full object-cover" />
                </div>
                <div className={landingPageStyles.collection}>
                    <h1 className="text-4xl font-medium">Restaurants</h1>
                    <div className="flex justify-between pb-8">
                        <h6 className="text-xl font-light text-gray-700">Explore curated lists of top restaurants, cafes, pubs, based on trends </h6>
                        {res.length > 0 && <Link to="/dashboard/shops">
                            <h6 className="text-lg  font-extralight text-red-300 select-none"> explore more <ArrowRightIcon className="text-red-300 cursor-pointer" /></h6>
                        </Link>}
                    </div>
                    <div className={landingPageStyles.shops}>
                        <Shops resturants={res} />
                    </div>
                </div>

            </div>
        </div >
    )
}
