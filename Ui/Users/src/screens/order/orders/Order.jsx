const BASE_URL = import.meta.env.VITE_API_URL;
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { removeDishId, selectDishId, selectShopId } from '../../../reducers/OrderReducer'
import { getShopdDetails, order, orderedDishes, } from '../../../services/apiConstants/apiServices'
import Timeslots from '../timeslots/Timeslots'
import TableBooking from '../table/TableBooking'
import OrderedDishes from '../dishes/OrderedDishes'
import Offers from '../offers/Offers'
import Toaster from '../../../utils/Toster/Toaster'


import { Button, Divider, Typography } from '@mui/material'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import orderStyles from './order.module.css'
import { useNavigate } from 'react-router-dom'






export default function Order() {

    const [shpData, setshpData] = useState('')
    const [dishData, setDishdata] = useState([])
    const [price, setPrice] = useState()

    const [Bdate, setBdate] = useState(new Date().toISOString().split('T')[0])
    const [timeSlot, setTimeSLot] = useState('')
    const [tableId, setTableId] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const dishId = useSelector(selectDishId);
    const shopId = useSelector(selectShopId);


    const setDishIdAndRemove = (id) => {
        dispatch(removeDishId(id));
    }

    const dishDetails = () => {
        const body = {
            orderDishArray: dishId
        }
        orderedDishes(shopId, body).then((response) => {
            setDishdata(response?.data?.dishDetailArray)
            setPrice(response?.data?.totalPrice)
        }).catch((error) => {
            console.error(error);
        })
    }
    console.log(price);

    const shopDetails = () => {
        getShopdDetails(shopId).then((response) => {
            setshpData(response?.data?.shops)
            console.log(response?.data);
        }).catch((error) => {
            console.error(error);
        })
    }

    const backToDishes = () => {
        navigate("/dashboard/Dishes")
    }


    const PlaceOrder = () => {
        const requiredIds = [
            { id: Bdate, name: "Booked Date" },
            { id: tableId, name: "Table" },
            { id: shopId, name: "Shop" },
            { id: timeSlot, name: "Time Slot" },
            { id: dishId, name: "Dish" },
        ];

        const missingIds = requiredIds.filter(item => {
            if (item.name === "Dish") {
                return !Array.isArray(item.id) || item.id.length === 0;
            }
            return !item.id;
        });

        if (missingIds.length > 0) {
            const missingIdNames = missingIds.map(item => item.name).join(", ");
            const errorMessage = missingIds.length > 1
                ? `${missingIdNames} are missing.`
                : `${missingIdNames} is missing.`;
            Toaster(errorMessage, 40, ["error"]);
            return;
        }

        const body = {
            bookedDate: Bdate,
            shopTableId: tableId,
            shopId: shopId,
            shopTimeslotId: timeSlot,
            orderDishId: dishId,
            totalPrice: price,
        };

        order(body)
            .then(() => {
                Toaster("👏 Good Job!", 80, ["success"]);
                navigate("/dashboard/orderHistory")
            })
            .catch((error) => {
                const errorMsg = error?.response?.data?.message || "An error occurred";
                Toaster(errorMsg, 40, ["error"]);
                console.error(error);
            });
    }






    useEffect(() => {
        shopDetails();
        dishDetails();
    }, [shopId, dishId])



    return (
        <div style={{
            maxHeight: '100vh',
            width: '100%',
            height: '100vh',
            overflowY: "scroll"
        }}>
            <div className={orderStyles.oders}>
                <div className={orderStyles.maindiv}>
                    <Typography variant='h4' sx={{
                        fontSize: '2rem',
                        color: '#333',
                        padding: '20px 0px'
                    }}
                    >
                        Order summary
                    </Typography>
                    <div className={orderStyles.imageContainer}>
                        <img
                            src={`${BASE_URL}${shpData?.shopImage}`} alt="Shop"
                            className={orderStyles.shpImg}
                        />
                    </div>
                    <Typography variant='h4' sx={{
                        paddingTop: '10px',
                        fontSize: '2rem'
                    }}>{shpData.shopName}</Typography>

                    <Typography variant='h6' sx={{
                        color: 'rgb(105, 105, 105)',
                        textTransform: 'none',
                        fontSize: '1rem',
                    }}>
                        <LocationOnIcon />  {shpData?.address}
                    </Typography>

                    <div className={orderStyles.shpDlt}>

                        <div style={{ display: 'flex' }}>
                            <Typography >
                                <LocalPhoneIcon sx={{ color: 'green' }} />  Phone:
                            </Typography>
                            <Typography sx={{
                                color: 'rgb(105, 105, 105)',
                            }}>  {shpData.phoneNumber}</Typography>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <Typography >
                                <EmailIcon sx={{
                                    color: '#D93025',
                                }} />  Email:
                            </Typography>
                            <Typography sx={{
                                color: 'rgb(105, 105, 105)',
                            }}>{shpData?.email}</Typography>
                        </div>

                    </div>

                    <Divider variant='fullWidth'></Divider>

                    <div className={orderStyles.dish}>
                        <Typography variant='h6' sx={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: '#333',
                            padding: '10px 10px 10px 0px'
                        }} >Your Dishes</Typography>
                        {dishData.length > 0 ? dishData?.map((row) => (
                            <OrderedDishes key={row.id} dish={row} setDishId={setDishIdAndRemove} />
                        )) : <Typography sx={{
                            color: 'red',
                        }}>
                            No dish selected !
                        </Typography>}
                    </div>

                    <Offers />

                    <Divider variant='fullWidth'></Divider>

                    <Timeslots setDate={setBdate} setTime={setTimeSLot} />

                    <TableBooking setTableId={setTableId} bookingDate={Bdate} bookingTime={timeSlot} />
                    
                    <Typography variant='h6' className={orderStyles.totalPrice}>
                        Total amount :
                        <CurrencyRupeeIcon /> {price}
                    </Typography>

                    <div className={orderStyles.Buttons}>
                        <Button variant='contained' className={orderStyles.orderButton} onClick={() => PlaceOrder()}>
                            Place your order
                        </Button>
                        <Button variant='contained' className={orderStyles.backButton} startIcon={<ArrowBackIcon />} onClick={() => { backToDishes() }}>
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )
}




