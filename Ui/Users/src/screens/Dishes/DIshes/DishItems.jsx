const BASE_URL = import.meta.env.VITE_API_URL;
import PropTypes from "prop-types"
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import styles from './dishStyles.module.css';


export default function DishItem({ dish, selected, onSelect }) {
    
    // const [selectedQuantity, setSelectedQuantity] = useState(1);

    // const handleQuantityChange = (event) => {
    //     const newQuantity = event.target.value;
    //     setSelectedQuantity(newQuantity);
    //     handleChangeQuantity(dish?.id, newQuantity);
    // };

    // const quantityOptions = Array.from({ length: dish?.dishQuantity }, (_, index) => index + 1);

    return (
        <div className={styles.subDishes}>
            <Checkbox
                checked={selected}
                onChange={onSelect} />
            <div className={styles.dishImageContainer}>
                <img className={styles.imags} src={`${BASE_URL}${dish?.dishImage}`} alt="Dish" />

            </div>
            <div className={styles.DishDetails}>
                <div className={styles.dishHeader}>
                    <Typography variant='h4' sx={{ fontFamily: 'serif' }}>{dish?.dishName}</Typography>
                    <Typography variant='h6' className={styles.dishPrice}>
                        <CurrencyRupeeIcon /> {dish?.price}
                    </Typography>
                </div>
                <div className={styles.dishHeader}>
                    <div>
                        <Rating name="half-rating" defaultValue={2} readOnly />
                        <Typography sx={{ fontFamily: 'sans-serif', color: 'rgb(79, 79, 79)' }}>
                            {dish?.discription}
                        </Typography>
                    </div>

                    {/* <FormControl sx={{ width: 70, background: 'white' }}>
                        <InputLabel id={`quantity-label-${dish.id}`}>Qty</InputLabel>
                        <Select
                            labelId={`quantity-label-${dish .id}`}
                            id={`quantity-select-${dish.id}`}
                            label="Quantity"
                            value={selectedQuantity}
                            onChange={handleQuantityChange}
                        >
                            {quantityOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                </div>

            </div>
        </div>
    );
}

DishItem.propTypes = {
    dish: PropTypes.shape({
        discription: PropTypes.any,
        dishImage: PropTypes.any,
        dishName: PropTypes.any,
        dishQuantity: PropTypes.any,
        id: PropTypes.any,
        price: PropTypes.any
    }),
    handleChangeQuantity: PropTypes.func,
    onSelect: PropTypes.any,
    selected: PropTypes.any
}




