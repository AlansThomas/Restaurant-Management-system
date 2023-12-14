import { Pagination, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getOrderHistory } from 'src/services/AdminServices'
import toastConfig from '../../../utils/toastConfig'
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Import toastr CSS (optional, for styling)
const Orderhistory = () => {

  const [orderHistory, setOrderHistory] = useState([]);
  const [totalPages, setTotalPages] = useState('')
  const [currentPage, setCurrentPage] = useState(1)


  const getHistory = async () => {
    try {
      const res = await getOrderHistory(currentPage);
      if (res.status === 200) {

        setCurrentPage(res.data.currentPage)
        setTotalPages(res.data.totalPages)
        setOrderHistory(res.data.dishBookingOrders); // Assuming your API response contains the order history data
      } else {
        toastr.info('Something went wrong!', 'Info', toastConfig);

      }
    } catch (error) {
      console.error("Error fetching order history", error);
    }
  }
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    getHistory();
  }, [currentPage]); // Empty dependency array means this effect runs once on component mount

  return (
    <div>
      <h3 style={{ marginLeft: '.8rem', color: 'grey' }}>Order History</h3>

      <Table sx={{ minWidth: 650, backgroundColor: 'white' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Order ID</TableCell>
            <TableCell align="center">Dish Name</TableCell>
            {/* <TableCell align="center">Dish Image</TableCell> */}
            <TableCell align="center">Dish Quantity</TableCell>
            <TableCell align="center">Dish Price</TableCell>
            {/* <TableCell align="center">Shop Name</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {orderHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span>No data found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            orderHistory.map((data) => (
              <TableRow key={data.id}>
                <TableCell align="center">{data.id}</TableCell>
                <TableCell align="center">{data.dish.dishName}</TableCell>
                <TableCell align="center">{data.dish.dishQuantity}</TableCell>
                <TableCell align="center">{data.dish.price}</TableCell>
                {/* <TableCell align="center">{data.order_history.shop}</TableCell> */}

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div style={{ float: 'right', marginTop: '14px' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </div>
    </div>

  )
}

export default Orderhistory