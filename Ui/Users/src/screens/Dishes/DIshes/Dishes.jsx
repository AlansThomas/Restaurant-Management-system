
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { getCmp1SearchValue, setSearchValue1 } from '../../../reducers/SearchReducer';
import { selectShopId, setDishId } from '../../../reducers/OrderReducer';
import { dishSearch, getMasterDishes } from '../../../services/apiConstants/apiServices';

import Filters from '../../../utils/filters/Filters';
import SearchBar from '../../../utils/searchBar/SearchBar';
import { infiniteScrollTrigerFunction } from '../../../utils/pagination/infiniteScroll';
import MasterDishes from '../MasterDishes/MasterDishes';

import { Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import DishItem from './DishItems';
import styles from './dishStyles.module.css';





export default function Dishes() {
    const [page, setPage] = useState(1);
    const [masterPage, setmMasterPage] = useState(1)
    const [data, setData] = useState([])
    const [dishes, setDishes] = useState([])
    const [show, setShow] = useState(false)
    const [mId, setmId] = useState('')
    const [filterVal, setFilterVal] = useState('')
    const [selectedDishIds, setSelectedDishIds] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const searchValue = useSelector(getCmp1SearchValue);
    const shop = useSelector(selectShopId)

    const searchDish = (e) => {
        setmMasterPage(1)
        setPage(1)
        setDishes([])
        const searchInfo = {
            dish: e.target.value,
        };
        dispatch(setSearchValue1(searchInfo.dish)); // to store search value to the redux
    };

    const filterData = (e) => {
        setPage(1)
        setmMasterPage(1)
        setData([])
        setDishes([])
        setFilterVal(e)
    }

    const masterDishId = (e) => {
        setmMasterPage(1)
        setPage(1)
        setData([])
        setmId(e)
    }


    const listMasterDishes = () => {
        const params = {
            page: masterPage,
            limit: 15
        }
        getMasterDishes(params).then((response) => {
            const masterDish = response?.data?.masterDish
            setData([...data, ...masterDish])
            setmMasterPage(masterPage + 1);
        }).catch((error) => {
            console.error(error);
        })
    }


    const showDishes = () => {       // Use filterValues in the API call here.
        setData([])
        setmMasterPage(1)
        const body = {
            limit: 10,
            page: page,
            search: searchValue,
            masterdishId: mId,
            shopId: shop,
            category: filterVal?.category,
            trending: filterVal?.trending,
            min: filterVal?.price?.min,
            max: filterVal?.price?.max,
            offer: filterVal?.offers
        };

        dishSearch(body)
            .then((response) => {
                const dish = response?.data?.shops
                response && setDishes([...dishes, ...dish]);
                setPage(page + 1);
            })
            .catch((err) => {
                console.error(err);
            });
    };



    const handleChange = (id) => {
        if (selectedDishIds.includes(id)) {
            setSelectedDishIds(selectedDishIds.filter(dishId => dishId !== id));  // Dish ID is already selected, remove it from the array

        } else {
            setSelectedDishIds([...selectedDishIds, id]);         // Dish ID is not selected, add it to the array

        }
    };

    const handleOrderClick = () => {
        dispatch(setDishId(selectedDishIds));
        navigate("/dashboard/order")
    };

    const clearAll = () => {
        listMasterDishes()
        setDishes([])
        setmMasterPage(1)
        setPage(1)
        setmId(null)
        setShow(false)
    }

  
    useEffect(() => {
        if (searchValue.length >= 1 ||
            mId ||
            filterVal?.category ||
            filterVal?.trending ||
            filterVal?.price?.min ||
            filterVal?.price?.max ||
            filterVal?.offers
        ) {
            showDishes();
            setShow(true)
        }
        else {
            setShow(false)
            listMasterDishes();
        }
    }, [searchValue, mId, filterVal])


    const getevent = infiniteScrollTrigerFunction(show ? showDishes : listMasterDishes);

    return (
        <div style={{
            maxHeight: '100vh',
            width: '100%',
            height: '100vh',
            overflowY: "scroll"
        }}
            onScroll={getevent}
        >
            <div style={{ display: 'flex', maxHeight: '100%', alignItems: 'center', position: 'relative', top: '9rem', flexDirection: 'column' }}>

                <SearchBar Search={searchDish} searchCmp={1} />
                <div className={styles.filters}>
                    <Filters handleSubmitProps={filterData} />
                    {selectedDishIds.length > 0 &&
                        <Button variant='contained'
                            className={styles.orderButton}
                            onClick={() => handleOrderClick()}
                        >
                            Place your order
                        </Button>}


                    {show && (
                        <Button variant='contained' className={styles.backButton} startIcon={<ArrowBackIcon />} onClick={() => clearAll()}>
                            Back
                        </Button>
                    )}

                </div>
                {!show && <MasterDishes data={data} onDishClick={masterDishId} />}
                {show && (
                    dishes.length > 0 ? (
                        dishes?.map((row) => (
                            <DishItem
                                key={row.id}
                                dish={row}
                                selected={selectedDishIds.includes(row.id)}
                                onSelect={() => handleChange(row.id)}
                            />
                        ))
                    ) : (<Typography sx={{ fontFamily: 'sans-serif', color: 'rgb(79, 79, 79)', paddingTop: '25px' }}>
                        Sorry, no related items were found.
                    </Typography>))
                }
            </div>
        </div>
    )
}
