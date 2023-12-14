import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';


// @mui


import { Grid, Container, Typography } from '@mui/material';
import {
  AppCurrentVisits,
  AppTrafficBySite,
  AppWidgetSummary,

} from '../../../sections/@dashboard/app';
import { getCounts, topDishes } from 'src/services/AdminServices';
import Transition from './Transition';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Import toastr CSS (optional, for styling)
import toastConfig from '../../../utils/toastConfig'

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [users, totalUsers] = useState('');

  const [ActiveCustomers, setActiveCustomers] = useState('');
  const [shops, setTotalActiveShops] = useState('');
  const [booking, setTotalBookings] = useState('')
  const [isGraphLoading, setIsGraphLoading] = useState(true);
  useEffect(() => {
    getCounts()
      .then((data) => {

        totalUsers(data.data.userCount);
        setActiveCustomers(data.data.ActiveUsers);
        setTotalActiveShops(data.data.shopCount);
        setTotalBookings(data.data.totalOrders);
        setIsGraphLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchTopDishes()
  }, [])
  const [top4dishes, setTopDishes] = useState([]); // Use a different name for state variable

  const fetchTopDishes = async () => {
    try {
      const response = await topDishes(); // Assuming topDishes is a function that fetches data
      if (response.status === 200) {
        setTopDishes(response.data); // Update the state with the fetched data
      }
      else{
        toastr.info('Something went wrong!', 'Info', toastConfig);
        
      }
    } catch (error) {
      console.error("Error fetching top dishes:", error);
    }
  }
  const transformedData = top4dishes.map((dish, index) => ({
    name: dish.dishName,
    value: `${dish.count} Orders`,
    // You can add an icon here if needed
  }));

  const transformedDataGraph = top4dishes.map((dish, index) => ({
    label: dish.dishName, value: dish.count,    // You can add an icon here if needed
    }));


    return(
    <>
      <Helmet>
        <title> Restaurant Management System </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }} style={{ color: 'grey' }}>
          Hi, Welcome back
          <div >
        
</div>
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total users" total={users} icon={'ant-design:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Active user" total={ActiveCustomers} color="info" icon={'fa6-solid:users'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Restaurants" total={shops} color="warning" icon={'tabler:packages'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Bookings" total={booking} color="error" icon={'fluent:accessibility-checkmark-48-regular'} >
            
            </AppWidgetSummary>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
      {isGraphLoading ? (
       <div></div>
      ) : (
        <AppCurrentVisits
          title="Top 5 dishes"
          chartData={transformedDataGraph}
          chartColors={[
            theme.palette.primary.main,
            theme.palette.info.main,
            theme.palette.warning.main,
            theme.palette.error.main,
            theme.palette.grey.main,

          ]}
        />
      )}
    </Grid>
    
          <Grid item xs={12} md={6} lg={4}>
          {/* {transformedData.lenth>4 && ( */}

               <AppTrafficBySite
        title={<Transition />}
        list={transformedData}
      />

          </Grid>
        </Grid>
        <br/>

      </Container>

    </>
  );
}
