import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { addTimeslot } from 'src/services/AdminServices';
import { useState } from 'react';

function Timeslot() {
  const [open, setOpen] = React.useState(false);
  const [startTime, setStarttime] = useState('')
  const [endTime, setEndtime] = useState('')
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  async function AddTimeslot() {
    console.log("123456");
    // const isEmailValid = validateEmail(email);
    // const isPasswordValid = validatePassword(password);


    try {
      const requestBody = { startTime, endTime };
      const response = await addTimeslot(requestBody);


      if (response.status === 200) {
        window.location.reload()
        setOpen(false);

      }
    } catch (error) {
      console.log('Error logging in:', error);
      // setApiError(error.response?.data.message || 'An error occurred while logging in.');
      // Handle error
    }
  }
  const handletime = (e) => {
    const validKeys = /^[0-9\b]+$/; // Regular expression to allow only numbers and backspace (\b) key
    if (!validKeys.test(e.key)) {
      e.preventDefault();
    }
    const inputvalue = e.target.value + e.key;
    if (inputvalue > 24) {
      e.preventDefault();
    }
  }
  return (
    <div>
      <h3 style={{ marginLeft: '.8rem', color: 'grey' }}>Offer Details </h3>

      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Time Slot
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add time slot</DialogTitle>
          <DialogContent>
            <DialogContentText>

              From here Your can add start time and end time for the shop
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Start Time"
              type="text"
              fullWidth
              variant="standard"
              value={startTime}
              onChange={(e) => setStarttime(e.target.value)}
              onKeyPress={handletime}
            />
            <br />


            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="End Time"
              type="text"
              fullWidth
              value={endTime}
              onChange={(e) => setEndtime(e.target.value)}
              variant="standard"
              onKeyPress={handletime}

            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={AddTimeslot}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>

    </div>
  )
}

export default Timeslot