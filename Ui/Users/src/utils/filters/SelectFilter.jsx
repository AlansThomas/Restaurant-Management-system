import PropTypes from "prop-types"
import { useState, useEffect, } from "react";

import { getShopStatusInfo } from "../status/orderStatus";
import { FormatDate } from "../DatenTime/FormatDate";

import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';

import filterStyles from './filters.module.css';




export default function SelectFilter({ bookedDate, BookedStatus }) {

    const [date, setDate] = useState();
    const [status, setStatus] = useState();
    const [showFilters, setShowFilters] = useState(false);

    const statusInfo = getShopStatusInfo(status);




    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const handleChangeDate = (event) => {
        setDate(event.target.value);
    }

    const clear = (id) => {
        if (id == 1) {
            setStatus('');
        }
        if (id == 2) {
            setDate('');
        }
    };



    useEffect(() => {
        bookedDate(date);
        BookedStatus(status);
    }, [date, status])



    return (
        <div className={filterStyles.select}>
            <IconButton onClick={() => setShowFilters(!showFilters)} sx={{
                height: '56px',
                width: '56px'
                , background: showFilters ? '#f0c0b6' : '#eaf1fb',
                '&:hover': {
                    background: showFilters ? '#f0c0b6' : '#eaf1fb',
                },
            }} title="filters">
                <FilterListIcon />
            </IconButton>
            {showFilters && (
                <div className={filterStyles.filterContainer}>

                    {!date &&
                        <FormControl sx={{ width: 200, background: 'white' }}>
                            <TextField
                                type="Date"
                                autoComplete="off"
                                id="date"
                                name="date"
                                onChange={(e) => handleChangeDate(e)}
                            />
                        </FormControl>
                    }

                    {date &&
                        <div className={filterStyles.selStatus}>
                            <Typography> {FormatDate(date)} </Typography>
                            <IconButton onClick={() => clear(2)}>
                                <CloseIcon sx={{ fontSize: '1.2rem', color: 'white' }} />
                            </IconButton >
                        </div>
                    }

                    {!status &&
                        <FormControl sx={{ width: 200, background: 'white' }}>
                            <InputLabel id="demo-simple-select-label">Booked status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status === undefined ? '' : status}
                                label="Booked status"
                                onChange={handleChangeStatus}
                            >
                                <MenuItem value={1}>Order placed</MenuItem>
                                <MenuItem value={2}>Pending</MenuItem>
                                <MenuItem value={3}>Accepted</MenuItem>
                                <MenuItem value={4}>Finished</MenuItem>
                                <MenuItem value={5}>Canceled</MenuItem>
                            </Select>
                        </FormControl>
                    }

                    {status &&
                        <div className={filterStyles.selStatus}>
                            <Typography> {statusInfo.statusText} </Typography>
                            <IconButton onClick={() => clear(1)}>
                                <CloseIcon sx={{ fontSize: '1.2rem', color: 'white' }} />
                            </IconButton>
                        </div>

                    }

                </div>
            )}


        </div>
    )
}

SelectFilter.propTypes = {
    BookedStatus: PropTypes.func,
    bookedDate: PropTypes.func
}

