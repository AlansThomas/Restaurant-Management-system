import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types"

import { selectShopId } from "../../../reducers/OrderReducer";
import { getTimeSlots } from "../../../services/apiConstants/apiServices";

import { MenuItem, Select, TextField, Typography } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import timestyles from './timeslots.module.css'


export default function   Timeslots({ setDate, setTime }) {
  const [timeSlots, setTimeSlots] = useState([])

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);      // Calculate the maximum date (2 weeks from today)
  const maxDateString = maxDate.toISOString().split('T')[0];
  const shopId = useSelector(selectShopId);



  const shopsTimeSlots = () => {
    const body = {
      shopID: shopId
    }
    getTimeSlots(body).then((response) => {
      console.log(response.data);
      setTimeSlots(response?.data?.timeSlot)
    }).catch((error) => {
      console.error(error);
    })
  }

  const handleKeyDown = (event) => {
    event.preventDefault(); // Prevent entering a date beyond the maximum
  };

  const handleChangeDate = (e) => {
    console.log(e.target?.value);
    setDate(e.target?.value)
  }
  const handleChangeTimeSlot = (e) => {
    console.log(e.target?.value);
    setTime(e.target?.value)
  }

  useEffect(() => {
    shopsTimeSlots()
  }, [shopId])

  return (
    <div className={timestyles.maindiv}>
      <Typography sx={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#333',
        padding: '10px',
      }}>
        Delight in Delectable Dishes, Choose Your Perfect Time Slot
      </Typography>
      <div className={timestyles.timesnDate}>
        <TextField
          type="Date"
          autoComplete="off"
          id="date"
          name="date"
          onChange={(e) => handleChangeDate(e)}
          onKeyDown={handleKeyDown} // Prevent entering dates beyond the maximum
          defaultValue={new Date().toISOString().split('T')[0]}
          inputProps={{
            min: new Date().toISOString().split('T')[0], // Set the minimum date to today
            max: maxDateString, // Set the maximum date
          }}
          sx={{ width: '200px' }}
        />
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name="time"
          defaultValue="select"
          onChange={(e) => handleChangeTimeSlot(e)}
          IconComponent={AccessTimeIcon}
          sx={{
            width: '200px',
          }}
        >
          {timeSlots.length > 0 ? (
            timeSlots.map((slot) => (
              <MenuItem key={slot.id} value={slot?.id}>
                {slot?.startTime}-{slot?.endTime}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="noSlots" disabled>No time slots available</MenuItem>
          )}
        </Select>
      </div>
    </div >
  )
}

Timeslots.propTypes = {
  setDate: PropTypes.func,
  setTime: PropTypes.func
}



