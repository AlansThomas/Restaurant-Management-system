import { useEffect, useState } from 'react';
import { getOrderHistory } from '../../../services/apiConstants/apiServices';
import SelectFilter from '../../../utils/filters/SelectFilter';
import { infiniteScrollTrigerFunction } from '../../../utils/pagination/infiniteScroll';
import OrderCard from './OrderCard';

import { Typography } from '@mui/material';
import styles from './myOrders.module.css';



export default function MyOrders() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [date, setDate] = useState()
  const [status, setStatus] = useState()

  const bookedDate = (e) => {
    setData([])
    setPage(1)
    setDate(e)
  }

  const bookedStatus = (e) => {
    setData([])
    setPage(1)
    setStatus(e)
  }
  const getMyorders = () => {
    const body = {
      page: page,
      limit: 10,
      status: status,
      bookedDate: date
    }
    getOrderHistory(body).then((response) => {
      const hisdata = response.data.orderHistoryView.ordersWithDishes
      setData([...data, ...hisdata])
      setPage(page + 1)
    }).catch((err) => {
      console.error(err);
    })
  }

  const getevent = infiniteScrollTrigerFunction(getMyorders);

  useEffect(() => {

    getMyorders();
  }, [status, date])

  console.log(page);
  return (
    <div className={styles.main} onScroll={getevent}>
      <div className={styles.mainDiv}>
        <div className={styles.orders}>
          <Typography variant='h4' sx={{
            fontSize: '2rem',
            color: '#333',
            padding: '20px 0px'
          }}
          >
            My Orders
          </Typography>
          <div className={styles.filters}>
            <SelectFilter bookedDate={bookedDate} BookedStatus={bookedStatus} />
          </div>
          <div className={styles.cards}>
            {data?.length > 0 ? data?.map((row) => (
              <OrderCard
                key={row?.orderDetails?.id}
                row={row}
                reload={getMyorders}
              />

            )) : <img
              src="/assets/noOrder.gif"
              className="h-260 mx-auto my-5 xs:my-10 sm:my-10"
              alt="404 Not Found"
            />}
          </div>
        </div>
      </div>
    </div>
  )
}


