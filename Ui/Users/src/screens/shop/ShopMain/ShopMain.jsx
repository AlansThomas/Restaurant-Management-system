import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCmp2SearchValue, setSearchValue2 } from '../../../reducers/SearchReducer';
import { getShops } from '../../../services/apiConstants/apiServices';
import SearchBar from '../../../utils/searchBar/SearchBar';
import { infiniteScrollTrigerFunction } from '../../../utils/pagination/infiniteScroll';
import Shops from '../shop/Shops';
import styles from './shopsMain.module.css';


function ShopMain() {
    const [page, setPage] = useState(1);
    const [res, setRes] = useState([])
    const dispatch = useDispatch();
    const searchValue = useSelector(getCmp2SearchValue);
    console.log(searchValue);
    const searchDish = (e) => {
        setPage(1)
        setRes([])
        const searchInfo = {
            shop: e.target.value
        }
        dispatch(setSearchValue2(searchInfo.shop));
    }




    const parms = {
        search: searchValue,
        page: page,
        limit: 10
    }

    const Resturants = () => {
        getShops(parms)
            .then((response) => {

                const dish = response?.data?.shops
                response && setRes([...res, ...dish]);
                setPage(page + 1);
                console.log(response?.data?.shops);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const getevent = infiniteScrollTrigerFunction(Resturants)


    useEffect(() => {
        Resturants();
    }, [searchValue])

    return (
        <div style={{ overflowY: 'scroll', maxHeight: '100vh', height: '100vh' }} onScroll={getevent}>
            <div className={styles.mainDiv}>
                <SearchBar Search={searchDish} searchCmp={2} />
                <div style={{ width: '70%' }}>
                    <h1 className="text-4xl font-medium pt-10">Restaurants</h1>
                    <h6 className="text-xl font-light text-gray-700">Explore curated lists of top restaurants, cafes, pubs, based on trends </h6>
                </div>
                <div className={styles.shops}>
                    <Shops resturants={res} />
                </div>
            </div>
        </div>
    )
}

export default ShopMain