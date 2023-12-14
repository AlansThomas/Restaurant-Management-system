const BASE_URL = import.meta.env.VITE_API_URL;
import PropTypes from "prop-types";


import { Avatar, Typography } from '@mui/material';
import Dishstyles from './masterdishes.module.css';



export default function MasterDishes({ data, onDishClick }) {



  return (
    <div className={Dishstyles.MasterDishes}>
      <Typography variant='h4' sx={{ fontFamily: 'serif', paddingTop: '50px', paddingBottom: '25px' }}>
        Top Dishes for you
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        {data.map((dish) => (
          <div key={dish?.id} className={Dishstyles.dishDIv} onClick={() => onDishClick(dish?.id)} >
            <div className={Dishstyles.imageContainer}>
              <Avatar
                sx={{
                  height: '10rem',
                  width: '10rem',
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  },
                }}
                src={`${BASE_URL}${dish?.masterDishImage}`}
                alt=""

              />
            </div>
            <Typography variant='h5' sx={{ fontFamily: 'serif' }}> {dish?.masterDishName}</Typography>
          </div>
        ))}
      </div>
    </div>
  )
}

MasterDishes.propTypes = {
  data: PropTypes.shape({
    map: PropTypes.func
  }),
  onDishClick: PropTypes.func
}


