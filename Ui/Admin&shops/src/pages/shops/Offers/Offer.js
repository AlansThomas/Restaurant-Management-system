  import React, { useEffect, useState } from 'react'
  import TableCell from '@mui/material/TableCell';
  //import TableContainer from '@mui/material/TableContainer';
  import TextField from '@mui/material/TextField';
  import TableRow from '@mui/material/TableRow';
  import TableHead from '@mui/material/TableHead';
  import TableBody from '@mui/material/TableBody';
  import Table from '@mui/material/Table';
  import axios from 'axios';
  import DeleteIcon from '@mui/icons-material/Delete';
  import ModeIcon from '@mui/icons-material/Mode';
  import IconButton from '@mui/material/IconButton';
  //import { mdiPencil } from '@mdi/js';
  import moment from 'moment';
  import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from '@mui/material';
  
  const Offer = () => {
    const [details,setDetails] = useState([])
    const [offerName,setOfferName] = useState('')
    const [description,setDescription] = useState('')
    const [startDate,setStartDate] = useState('')
    const [endDate,setEndDate] = useState('')
    const [discount,setDiscount] = useState('')
    const [open, setOpen] = React.useState(false);
    const [idofOffer,setShopId] = useState('')
    const [totalPages,setTotalPages] = useState(1)
    const [currentPage,setCurrentPage] = useState(1)
    console.log(idofOffer)
    const handlePageChange = (event, newPage) => {
console.log(newPage);
      setCurrentPage(newPage);
    };
    const handleClose = () => {
      setOpen(false);
    };
    useEffect(() => {
      fetchShops();
    }, []); 
    
    useEffect(() => {
      fetchShops(currentPage);
    }, [currentPage]); 
    const fetchShops = async () => {
      try {
        const config = {
          headers: {
            // Add your desired headers here
            Authorization: ` eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb3lhbEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IkhtZEAxMjM0NSIsImlhdCI6MTY5MTQ5MzcyNCwiZXhwIjoxNjkxNDk3MzI0fQ.mIKq-JiEO-YZfwDGAadv019b7QUeX9UlIzyJhEvpIZk`, // Example of an authorization header
            'Content-Type': 'application/json', // Example of a content type header
          },
        };
    
        const response = await axios.get(`http://localhost:4000/user/getShopOffers/?page=${currentPage}`, config);
    
        console.log("Response:", response.data);
        setDetails(response.data.offers);  
        setTotalPages(response.data.totalPages) 
        setCurrentPage(Response.data.page)
        // setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log('Error fetching shops:', error);
      }
    };

    async function editPackage(idofOffer) {
      const data = new FormData();
      data.set('offerName', offerName);
      data.set('description', description);
      data.set('startDate', startDate);
      data.set('endDate', endDate);
      data.set('discount', discount);
    
      const config = {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb3lhbEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IkhtZEAxMjM0NSIsImlhdCI6MTY5MTQ5MzcyNCwiZXhwIjoxNjkxNDk3MzI0fQ.mIKq-JiEO-YZfwDGAadv019b7QUeX9UlIzyJhEvpIZk`,
          'Content-Type': 'application/json',
        },
      };
    
      try {
        const res = await axios.put(`http://localhost:4000/user/offers/${idofOffer}`, data, config);
        // if(res.status === 200){
      setOpen(false);
// 
        // }
        if (!res.status === 200) {
          throw new Error('Failed to edit package');

        }
    
        console.log(res, "3eee");
        // Handle the successful response here
        // setOpen(false);
    
      } catch (error) {
        console.log('Error editing package:', error);
      }
    }

    function editSpecificPackage(selectedId, offerName, description, startDate, endDate, discount) {
      // Update the idofOffer state with the selected offer ID
      setShopId(selectedId);
      console.log(selectedId)
      setOfferName(offerName);
      setDescription(description);
      setStartDate(startDate);
      setEndDate(endDate);
      setDiscount(discount);
      // Set the dialog to open
      setOpen(true);
    }
    const deleteShop = async (id) => {
      try {
        const config = {
          headers: {
            // Add your desired headers here
            Authorization: ` eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb3lhbEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IkhtZEAxMjM0NSIsImlhdCI6MTY5MTQyMzA3MywiZXhwIjoxNjkxNDI2NjczfQ.iPT_AlVHlT6HiSr-a-ek9pBghzcEAmPTkNM8GmOZIb0`, // Example of an authorization header
            'Content-Type': 'application/json', // Example of a content type header
          },
        };
    
        const response = await axios.delete(`http://localhost:4000/user/offers/${id}`, config);
    
      
        if(response.status === 200){
          fetchShops()
          handleClose()
        }
        // setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log('Error fetching shops:', error);
      }
    };
     


    return (
      <div>
      <h3 style={{ marginLeft: '.8rem', color: 'grey' }}>Offer Details </h3>

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: '150px' }}>Offer Name</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Start Date</TableCell>
            <TableCell align="center">End Date</TableCell>
            <TableCell align="center">Discount</TableCell>
            <TableCell align="center">Action</TableCell>


            {/* <TableCell align="right">Shop Number</TableCell>
            <TableCell align="right">Start time</TableCell>
            <TableCell align="right">End time</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((row) => (
            <TableRow key={row.shopId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="center">{row.offerName}</TableCell>
              <TableCell align="center">{row.description}</TableCell>
              <TableCell align="center">{moment(row.startDate).format("DD/MM/YYYY")}</TableCell>
              <TableCell align="center">{moment(row.endDate).format("DD/MM/YYYY")}</TableCell>
              <TableCell align="center">{row.discount}</TableCell>
              <TableCell align="center">
              <IconButton label="reject" onClick={() => deleteShop(row.id)} >                
                        <DeleteIcon />
                      </IconButton>
                      <IconButton aria-label="reject" onClick={()  => editSpecificPackage(row.id,row.offerName, row.description, moment(row.startDate).format("YYYY-MM-DD"), moment(row.endDate).format("YYYY-MM-DD"), row.discount)} >
                        <ModeIcon />
                      </IconButton>

              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                />
              </div>
      <>
      <Dialog open={open} onClose={handleClose} >

        <DialogTitle>Edit Offer details</DialogTitle>

        <DialogContent>
       
          <DialogContentText>

            You can edit the offer details from here by filling below fields
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Offer Name"
            type="text"
            fullWidth
            variant="standard"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}

            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Start Date"
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}

            fullWidth
            variant="standard"
          />
           <TextField
            autoFocus
            margin="dense"
            id="name"
            label="End Date"
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}

            fullWidth
            variant="standard"
          />
              <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Discount"
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}

            fullWidth
            variant="standard"
          />
         

      
  
  
          {/* </React.Fragment>
))} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { editPackage(idofOffer) }}>Proceed</Button>
        </DialogActions>
      </Dialog>
      </>
    </div>
  );
};

  export default Offer