
import PropTypes from "prop-types";

import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton, Typography } from '@mui/material';
import orderStyles from '../orders/order.module.css'


export default function OrderedDishes({ dish, setDishId }) {


    return (
        <div className={orderStyles.subDishes}>
            <div className={orderStyles.dishImageContainer}>
                <img className={orderStyles.imags} src={dish?.dishImage} alt="Dish" />
            </div>
            <div className={orderStyles.DishDetails}>
                <div className={orderStyles.dishHeader}>
                    <Typography variant='h6' className={orderStyles.dishName}>
                        {dish?.dishName}
                    </Typography>
                    <Typography variant='h6' className={orderStyles.dishPrice}>
                        <CurrencyRupeeIcon /> {dish?.price}
                    </Typography>
                </div>
                <Typography sx={{ fontFamily: 'sans-serif', color: 'rgb(79, 79, 79)' }}>
                    {dish?.discription}
                </Typography>
            </div>
            <IconButton onClick={() => setDishId(dish?.id)} title="Remove" sx={{
                color: 'red'
            }}>
                <HighlightOffIcon />
            </IconButton>
        </div>
    )
}

OrderedDishes.propTypes = {
    dish: PropTypes.shape({
        discription: PropTypes.any,
        dishImage: PropTypes.any,
        dishName: PropTypes.any,
        id: PropTypes.any,
        price: PropTypes.any
    }),
    setDishId: PropTypes.func
}

