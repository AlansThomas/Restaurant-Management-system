import PropTypes from "prop-types"
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectShopId } from '../../../reducers/OrderReducer';
import { getShopTables } from '../../../services/apiConstants/apiServices';
import { getTabelStatusInfo } from "../../../utils/status/tableStatus";
import Toaster from '../../../utils/Toster/Toaster';

// import ReactTableChair from 'react-dining-tables';
import { Typography } from '@mui/material';
import './table.css';







export default function TableBooking({ setTableId, bookingDate, bookingTime }) {

    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState('');

    const shopId = useSelector(selectShopId);

    const selectTable = (table) => {
        console.log(table);
        setSelectedId(table?.tableId);

        if (table?.bookingStatus === 4) {
            Toaster("Already booked", 39, ["error"]);
        } else if (table?.bookingStatus === 2) {
            Toaster("Table is inactive", 40, ["error"]);
        } else if (table?.bookingStatus === 3) {
            Toaster("Table booking is on progress", 41, ["warning"]);
        }
        else if (table?.bookingStatus === 1) {
            Toaster("Table selected", 42, ["success"]);
            setTableId(table?.tableId);
        }
    };


    const getTables = () => {

        const body = {
            "bookedDate": bookingDate,
            "time_slot_id": bookingTime

        }
        getShopTables(shopId, body)
            .then((response) => {
                console.log(response.data.view);
                setData(response?.data?.view || []);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getTables();
    }, [bookingDate, bookingTime]);

    return (
        <>
            <Typography sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#333',
                padding: '10px',
            }}>
                Indulge in Exquisite Flavors, Reserve Your Table Now
            </Typography>
            {data.length > 0 ?
                <div className="table-container">

                    {data?.map((table, index) => (
                        <div
                            key={table?.tableId}
                            className={`table ${selectedId === table?.tableId ? 'tableSelected' : ''}`}
                        >
                            <div className="table-top" onClick={() => {
                                selectTable(table);
                            }}>
                                <div className="table-details">
                                    <h5> T {index + 1}</h5>
                                </div>
                            </div>
                            <div className="chairs">
                                {Array.from({ length: table?.noOfSeat || 0 }, () => {
                                    const { statusColor } = getTabelStatusInfo(table?.bookingStatus);
                                    return (
                                        <div
                                            key={table?.id}
                                            className="chair"
                                            style={{ backgroundColor: statusColor }}
                                        ></div>
                                    );
                                })}
                            </div>

                        </div>
                    ))}
                </div> :
                <Typography sx={{
                    color: 'red',
                    padding: '10px',
                }}>
                    No tables available !
                </Typography>}

        </>
    );
}

TableBooking.propTypes = {
    bookingDate: PropTypes.any,
    bookingTime: PropTypes.any,
    setTableId: PropTypes.func
}

