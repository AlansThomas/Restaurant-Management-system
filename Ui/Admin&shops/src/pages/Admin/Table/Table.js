import React, { useEffect, useState } from 'react';
import Loader from '../../../utils/Loader/loader';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { addTable, getTable, deleteTable } from '../../../services/AdminServices'
import Table from '@mui/material/Table';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import toastConfig from '../../../utils/toastConfig'
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Import toastr CSS (optional, for styling)
const TableManagement = () => {
  const [loading, setLoading] = useState(true);
  const [addTablee, setAddTable] = useState(false);
  const [tableError, setTableError] = useState('')
  const [details, setTableDetails] = useState('')
  const [tableCount, setCountTable] = React.useState('');
  const [tableType, setTableType] = useState("Couple-Type")

  const [availableSeats, setAvailableSeats] = useState({
    twoSeats: false,
    fourSeats: false,
    sixSeats: false,
    eightSeats: false
  });
  const handleChange = event => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      setTableError('')
    }
    if (selectedValue === 2) {
      setTableType('Couple Type');
    } else if (selectedValue === 4) {
      setTableType('Family Type');
    } else if (selectedValue === 6) {
      setTableType('Big Family Type');
    } else if (selectedValue === 8) {
      setTableType('Extra Large Type');
    }
    else{
      setTableType('')
    }
    setCountTable(selectedValue); // Update the state immediately

    
  }
  useEffect(() => {
    getTables()
  }, [])

  const getTables = async () => {
    try {
      setLoading(true)
      const res = await getTable();
      if (res.status === 200) {
        setLoading(false)
      }else{
        setLoading(true)
      }
      const dataCheck = res.data;
      setTableDetails(dataCheck)
      const noOfTablesValues = dataCheck.map(item => item.noOfSeats);
    
      setAvailableSeats({
        twoSeats: noOfTablesValues.includes(2),
        fourSeats: noOfTablesValues.includes(4),
        sixSeats: noOfTablesValues.includes(6),
        eightSeats: noOfTablesValues.includes(8)
      });

    } catch (error) {
      setLoading(false)

      console.error("Error fetching data:", error);
    }
  };

  const tableAdd = async () => {
    const data = {
      tableType: tableType,
      noOfSeats: tableCount
    }
    if (tableCount === '') {
      setTableError("Table count is required.")
      return;
    }
    try {
      setLoading(true)
      const res = await addTable(data)
      if (res.status === 200) {
        setTableError('')
        // setLoading(false)
        setAddTable(false)     
        toastr.success('Table added successfully!', 'Success', toastConfig);
        setTimeout(() => {
          setLoading(false);
          getTables();
        }, 1500)
        setCountTable('')
      }else{
        setLoading(false);
        toastr.error('Failed to add table. Please try again later.', 'Error', toastConfig);
      }
      
    }
    catch (er) {
      setLoading(false)

    }
  }

  const delTable = async (id) => {
    try {
      setLoading(true)
      const res = await deleteTable(id)

      if (res.status === 200) {
        toastr.error('Table deleted!', 'Deleted', toastConfig);
        setTimeout(() => {
          setLoading(false);
          getTables();

        }, 2000)

      }else{
        setLoading(false);
        toastr.error('Failed to delete table. Please try again later.', 'Error', toastConfig);
      }

    } catch (er) {
      setLoading(false)
      return er
    }
  }
  const openAddTable = () => {
    setAddTable(true)
  }
  const close = () => {
    setAddTable(false)
    setCountTable('')
    setTableError('')
  }

  return (
    <div>
    
        <div>
          <Button variant='outlined' style={{ float: 'right', marginTop: '-7px' }} onClick={openAddTable}><AddIcon />Add</Button>
          <h3 style={{ marginLeft: '.8rem', color: 'grey' }}>Table Details</h3>
          {loading ? (
        <Loader />
      ) : (
      
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Table ID</TableCell>
                  <TableCell align="center">Table Type</TableCell>
                  <TableCell align="center">No. of Table</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.length === 0 ? ( // Check if filteredData is empty
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span>No data found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  details.map((data) => (
                    <TableRow key={data.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center">{data.id}</TableCell>
                      <TableCell align="center">{data.tableType}</TableCell>
                      <TableCell align="center">
                        {data.noOfSeats}
                      </TableCell>
                      <TableCell align="center">
                        <DeleteIcon style={{ color: 'grey', cursor: 'pointer', marginLeft: '20px' }} onClick={() => delTable(data.id)} />

                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
      )}
          <Dialog open={addTablee} fullWidth>
            <DialogTitle>Add Tables</DialogTitle>
            <DialogContent style={{ display: 'grid', flexDirection: 'column', alignItems: 'center' }}>
              <DialogContentText>
                You can add Tables count from here
              </DialogContentText>
            
              <br />
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Count of tables</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tableCount}
                    label="Count of tables*"
                    onChange={handleChange}
                  >
                    {availableSeats.twoSeats && availableSeats.fourSeats && availableSeats.sixSeats && availableSeats.eightSeats && (
                      <MenuItem disabled style={{ color: 'red' }}>
                        No available seat options
                      </MenuItem>
                    )}
                    {!availableSeats.twoSeats && <MenuItem value={2}>Two</MenuItem>}
                    {!availableSeats.fourSeats && <MenuItem value={4}>Four</MenuItem>}
                    {!availableSeats.sixSeats && <MenuItem value={6}>Six</MenuItem>}
                    {!availableSeats.eightSeats && <MenuItem value={8}>Eight</MenuItem>}
                  </Select>
                </FormControl>

              </Box>
              <br />
              {tableCount && (
                <TextField
                  label="Table Type"
                  value={tableType}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                    style: { color: 'black' }
                  }}
                  fullWidth
                />)}
              <span style={{
                height: "20px",
                color: "red",
                margin: 0,
                padding: 0,
                display: "flex",
                alignItems: "center"
              }}>{tableError}</span>
             

            </DialogContent>

            <DialogActions>
              <Button onClick={close} >Cancel</Button>
              <Button onClick={tableAdd} >Proceed</Button>
            </DialogActions>
          </Dialog>
        </div>
     
    </div>

  );
};

export default TableManagement;
