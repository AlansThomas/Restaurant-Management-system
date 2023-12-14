const BASE_URL = import.meta.env.VITE_API_URL;
import PropTypes from "prop-types"
import { orderCheckIn, orderCheckOut } from '../../../services/apiConstants/apiServices';
import { getShopStatusInfo } from '../../../utils/status/orderStatus';
import { FormatDate, currentDate, currentHour } from "../../../utils/DatenTime/FormatDate";
import Toaster from "../../../utils/Toster/Toaster";

import { Avatar, Button, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import styles from './myOrders.module.css';


export default function OrderCard({ row, reload }) {

  const isToday = row?.orderDetails?.bookedDate === currentDate;
  const isPastDate = row?.orderDetails?.bookedDate < currentDate;

  const isCurrentHour = isToday &&
    row?.orderDetails.shop_timeslot?.startTime == currentHour &&
    row?.orderDetails.shop_timeslot?.endTime >= currentHour;

  const isPastHour = isToday &&
    row?.orderDetails.shop_timeslot?.endTime <= currentHour;

  const isCheckedIn = row?.orderDetails?.checkedStatus === 1;
  const isCheckedOut = row?.orderDetails?.checkedStatus === 2;


  const generateReservationMessage = () => {
    let message;

    switch (true) {
      case isCurrentHour && isCheckedIn:
        message = "Your reserved time is now.";
        break;

      case isCurrentHour && !isCheckedIn && !isCheckedOut:
        message = "Your reservation is valid right now. Kindly check-in.";
        break;

      case isToday && isCheckedIn:
        message = "You have a reservation for today, and you are checked in.";
        break;

      case row?.orderDetails.shop_timeslot?.endTime <= currentHour && !isCheckedOut:
        message = "Reservation expired";
        break;

      case isPastDate && !isCheckedOut:
        message = "Reservation expired";
        break;

      default:
        message = "";
        break;
    }

    return message;
  };


  const handleAction = (actionFunction, actionName, toastId) => {
    actionFunction(row?.orderDetails?.id)
      .then((response) => {

        if (response?.data?.message) {
          Toaster(`🎉${response?.data?.message}`, 10, ["success"]);
        }

        Toaster(`${actionName} successful`, toastId, ["success"]);
        reload(row?.orderDetails?.id);
      })
      .catch((err) => {
        const errorMsg = err?.response?.data?.message || "An error occurred";
        Toaster(errorMsg, toastId, ["error"]);
        console.error(err);
      });
  };

  const checkIn = () => {
    handleAction(orderCheckIn, "Check-In", 42);
  }

  const checkOut = () => {
    handleAction(orderCheckOut, "Check-Out", 43);
  }

  const cancel = () => {
    alert(" This feature is being updated...")
  }

  return (
    <Card key={row?.orderDetails?.id} sx={{
      maxWidth: 400,
      boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}>
      <CardHeader
        avatar={
          <Avatar src={`${BASE_URL}${row?.orderDetails?.shop?.shopImage}`} sx={{ bgcolor: 'red[500]' }} aria-label="shop">
            {row?.orderDetails?.shop?.shopName}
          </Avatar>
        }
        title={row?.orderDetails?.shop?.shopName}
        subheader={`${FormatDate(row?.orderDetails?.bookedDate)}, ${row?.orderDetails?.shop_timeslot?.startTime} to ${row?.orderDetails?.shop_timeslot?.endTime} `}
      />
      <CardContent sx={{
        paddingBottom: '5px',
        maxHeight: '360px',
        overflow: 'auto',
        minHeight: '360px',
      }}>

        {row?.dishes?.map((dish) => (
          <div key={dish?.id} className={styles.subDishes}>
            <div className={styles.dishImageContainer}>
              <img className={styles.imags}
                src={`${BASE_URL}${dish?.dishImage}`}
                alt="Dish" />
            </div>
            <div className={styles.DishDetails}>
              <div className={styles.dishHeader}>
                <Typography variant='h6' className={styles.dishName}>
                  {dish?.dishName}
                </Typography>
                <Typography variant='h6' className={styles.dishPrice}>
                  <CurrencyRupeeIcon />
                  {dish?.price}
                </Typography>
              </div>
              <Typography sx={{ fontFamily: 'sans-serif', color: 'rgb(79, 79, 79)' }}>
                {dish?.discription}
              </Typography>
            </div>
          </div>
        ))}


      </CardContent>
      <CardActions disableSpacing sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant='h6' className={styles.totalPrice}>
          Total amount :
          <CurrencyRupeeIcon />{row?.orderDetails?.totalPrice}
        </Typography>
        {(() => {
          const { statusText, statusColor, StatusIcon } = getShopStatusInfo(row?.orderDetails?.bookedStatus);
          return (
            <div style={{ border: `2px solid ${statusColor}`, marginLeft: '10px', borderRadius: '5px', }}>
              <Typography style={{ color: statusColor, padding: '8px' }}> {StatusIcon} {statusText}</Typography>
            </div>
          );
        })()}

        <div>

          {isCurrentHour && !isCheckedIn && !isCheckedOut &&
            <IconButton aria-label="check-in"
              onClick={() => checkIn()}
            >
              <Button variant='contained' startIcon={<CheckCircleIcon />}> Check in</Button>
            </IconButton>
          }

          {isCheckedIn &&
            <IconButton aria-label="check-out"
              onClick={() => checkOut()}
            >
              <Button variant='contained' startIcon={<DoneAllIcon />}> Check out</Button>
            </IconButton>
          }

          {(row?.orderDetails?.bookedStatus < 4 && !isPastHour && !isPastDate) &&
            <IconButton aria-label="cancel"
              onClick={() => cancel()}
            >
              <Button variant='contained' startIcon={<CancelIcon />}> Cancel</Button>
            </IconButton>
          }

        </div>

        <Typography style={{ color: 'red', padding: '8px' }}>  {generateReservationMessage()}</Typography>

      </CardActions>

    </Card >
  )
}

OrderCard.propTypes = {
  reload: PropTypes.func,
  row: PropTypes.shape({
    dishes: PropTypes.shape({
      map: PropTypes.func
    }),
    orderDetails: PropTypes.shape({
      bookedDate: PropTypes.any,
      bookedStatus: PropTypes.number,
      checkedStatus: PropTypes.number,
      id: PropTypes.any,
      shop: PropTypes.shape({
        shopImage: PropTypes.any,
        shopName: PropTypes.any
      }),
      shop_timeslot: PropTypes.shape({
        endTime: PropTypes.any,
        startTime: PropTypes.any
      }),
      totalPrice: PropTypes.any
    })
  })
}





