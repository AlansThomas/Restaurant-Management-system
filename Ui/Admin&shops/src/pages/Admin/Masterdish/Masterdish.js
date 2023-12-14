import React, { useEffect, useState } from 'react'; // Import React and useState
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { AddMasterdish, deleteMasterDishes, getMasterdish, editMasterDishes } from 'src/services/AdminServices';
import AddIcon from '@mui/icons-material/Add';
import serverConfig from '../../../services/serverConfig'
import './Masterdish.css'
import toastConfig from '../../../utils/toastConfig'
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Import toastr CSS (optional, for styling)
import Loader from '../../../utils/Loader/loader'
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';

const Masterdish = () => {
  // Placeholder variables
  const [openMasterdish, setAddMasterdish] = useState(false)
  const [openEditmasterdish, setEditMasterDish] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [files, setNewImg] = useState('')
  const [masterdishname, setMasterdishname] = useState('')
  const [details, setDetails] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [masterdishNameError, setMasterDishNameError] = useState('')
  const [imgError, setError] = useState('')
  const [isAddMasterdishCompleted, setIsAddMasterdishCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addDisherror, setShopAddError] = useState('')
  const [hasChanges, setHasChanges] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [editID, setEditId] = useState('')

  useEffect(() => {
    fetchDishes(currentPage);
  }, [currentPage,]);
  const fetchDishes = async (page) => {
    try {
      setLoading(true)
      const response = await getMasterdish(page);
      if (response.status === 200) {
        setLoading(false)
      }else{
        toastr.info('Something went wrong!', 'Info', toastConfig);

      }
      setDetails(response.data.masterDish);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      setLoading(false);

    }
  };
  const [editImg, setNewDishImg] = useState(null)
  const handleNewImageChange = (event) => {
    setHasChanges(false);
    const EditImg = event.target.files;

    const file = event.target.files[0];
    setNewDishImg(file);
    setImageError('')

    if (file) {
      const fileFormat = file.name.split('.').pop().toUpperCase();
      const allowedFormats = ['JPEG', 'JPG', 'PNG', 'GIF'];
      const allowedSize = 2; // in MB
      if (!allowedFormats.includes(fileFormat)) {

        setError('Invalid Image! Please select a PNG, JPG,GIF or JPEG file.');
        setHasError(true); // Set hasError to true when there is an error
        setHasChanges(false);
      } else if (file.size / 1024 / 1024 > allowedSize) {

        setError(`Invalid Image! File size exceeds ${allowedSize} MB.`);
        setHasError(true); // Set hasError to true when there is an error
        setHasChanges(false);
      } else {
        setHasError(false); // Set hasError to false when there is no error
        setHasChanges(true);

        setNewImg(EditImg);

        setError('');

      }
    } else {
      setHasError(false); // Set hasError to false when there is no error
      setError('');
    }
  };

  const handleImageChange = (event) => {
    const mew1 = event.target.files
    setNewImg(mew1)

    const file = event.target.files[0];
    setSelectedImage(file);
    setImageError('')
    if (file) {
      const fileFormat = file.name.split('.').pop().toUpperCase();
      const allowedFormats = ['JPEG', 'JPG', 'PNG', 'GIF'];
      const allowedSize = 2; // in MB
      if (!allowedFormats.includes(fileFormat)) {
        setError('Invalid Image! Please select a PNG, JPG,GIF or JPEG file.');
      } else if (file.size / 1024 / 1024 > allowedSize) {
        setError(`Invalid Image! File size exceeds ${allowedSize} MB.`);
      } else {
        console.log(file);
      }
    }
  };
  const [editMDname, setEditMDName] = useState('')
  const [editMDImg, setEditMDImg] = useState('')

  const editMasterdish = (id, name, image) => {
    setEditId(id)
    setEditMDName(name)
    setEditMDImg(image)
    setEditMasterDish(true)
  }


  const handleCancelImage = () => {
    setSelectedImage(null);
    setError(false)
    setNewImg('')
    setShopAddError('')
  };
  const handleCandelEditImage = () => {
    setError(false)
    setNewDishImg(null)
    setEditMDImg(null)
    setHasChanges(true);
    setShopAddError('')

  }

  const close = () => {
    setMasterdishname('')
    setSelectedImage('')
    setShopAddError('')
    setAddMasterdish(false)
    setEditMasterDish(false)
    setNewDishImg(null)
    setEditMDImg(null)
    setError('')
    setMasterDishNameError('')
    setHasChanges(false);
    setImageError('')
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  function openAddmasterdish() {
    setAddMasterdish(true)
  }
  const handleDishNameChange = (e) => {
    const dishNameValue = e.target.value;
    setMasterdishname(dishNameValue);
    setShopAddError('');
    validateMasterdishName(dishNameValue);
  };
  const handleEditDishNameChange = (e) => {
    const dishNameValue = e.target.value;
    setHasChanges(true);
    setHasError(false)
    setEditMDName(dishNameValue);
    setShopAddError('');
    validateMasterdishName(dishNameValue);

  };

  const validateMasterdishName = (nameValue) => {
    const whitespaceRegex = /\s{2,}/
    if (!nameValue) {
      setMasterDishNameError('Master dish is required');
      return false;
    } else if (nameValue.length > 25) {
      setMasterDishNameError('Masterdish name must be at most 25 characters long');
      return false;
    }
    else if (whitespaceRegex.test(nameValue)) {
      setMasterDishNameError('Only one space is allowed between words/black space');
      return false;
    }
    else {
      setMasterDishNameError('');
      return true;
    }
  };
  const [ImgEr, setImageError] = useState('')
 const validateImage = (imageFile) => {
  if (!imageFile) {
    setImageError('Image is required');
    return false;
  } else {
    setImageError('');
    return true;
  }
};

  useEffect(() => {
    if (isAddMasterdishCompleted) {
      fetchDishes(currentPage);
      setIsAddMasterdishCompleted(false); // Reset the state after performing the action
    }
  }, [isAddMasterdishCompleted, currentPage]);

  const deleteMasterDish = async (id) => {

    try {
      setLoading(true);

      const res = await deleteMasterDishes(id);
      if (res.status === 200) {
        toastr.error('Restaurant deleted!', 'Deleted', toastConfig);
        setTimeout(() => {
          setLoading(false);
          fetchDishes(currentPage);
        }, 2000)

      }else{
        toastr.info('Something went wrong!', 'Info', toastConfig);
        
      }
    } catch (er) {
      setLoading(false);

      return er
    }

  }

  const updateMasterdish = async (editID) => {
    const isMasterDishValid = validateMasterdishName(editMDname);
    const isMasterDishImgValid = validateImage(editMDImg || editImg);

    if (isMasterDishValid && isMasterDishImgValid) {
      try {
        const data = new FormData();
        data.append('masterDishName', editMDname);
        if (editImg) {
          data.append('masterDishImage', files[0]);
        }
        else{
          data.append('masterDishImage','')
        }

        const res = await editMasterDishes(editID, data, 'multipart');

        if (res.status === 200) {

          setEditMasterDish(false);
          setHasError(true);
          fetchDishes(currentPage);
          setNewDishImg(null)
          setEditMDName(null)
          setEditMDImg(null)

          toastr.success('Masterdish Updated successfully!', 'Success', toastConfig);
        }


        else if (res.response.data.message === 'Unsupported file format. Only JPEG, JPG, PNG, and GIF images are allowed.') {
          setShopAddError('Image format corruption/invalid.Change it')
        }
        else if (res.response.data.message === 'master dish name must be unique') {
   
          setShopAddError('Masterdish name already used .Choose another one')
        }

        else if (editMDImg || editImg) {
          setEditMDImg(null)
        }
        else{
          setShopAddError(res.response.data.message)
        }
      } catch (error) {

        return error

      }
    }
  };
  async function addMasterdish(ev) {
    const isMasterDishValid = validateMasterdishName(masterdishname);
    const isMasterDishImgValid = validateImage(selectedImage);
  
    if (!(isMasterDishValid && isMasterDishImgValid)) return;
  
    try {
      const data = new FormData();
      data.append('masterDishName', masterdishname);
      data.append('masterDishImage', files[0] || ''); // Use files[0] if available, otherwise use an empty string
  
      const response = await AddMasterdish(data, 'multipart');
      setLoading(false); // Always hide the loader after the request
  
      if (response.status === 200) {
        setIsAddMasterdishCompleted(true);
        setAddMasterdish(false);
        setMasterdishname('');
        setSelectedImage('');
        setShopAddError('');
        setCurrentPage(1);
        toastr.success('Masterdish Added successfully!', 'Success', toastConfig);
      } else {
        handleErrorResponse(response);
      }
    } catch (error) {
      setLoading(false); // Hide the loader in case of an error
      handleErrorResponse(error);
    }
  }
  
  function handleErrorResponse(response) {
    if (response.response) {
      if (response.response.status === 500) {
        // Handle 500 status code
      } else if (response.response.data.message === 'master dish name must be unique') {
        setShopAddError(response.response.data.message);
      } else if (response.response.data.message === 'Unsupported file format. Only JPEG, JPG, PNG, and GIF images are allowed.') {
        setShopAddError('Image format corruption/invalid. Change it');
      } else {
        setShopAddError(response.response.data.message);
      }
    } else {
      // Handle other errors here
    }
  }
  

  return (
    <div>


      <div>
        <Button variant="outlined" style={{ float: 'right', marginBottom: '0rem', marginTop: '-7px' }} onClick={openAddmasterdish}>
          <AddIcon />  Add
        </Button>
        <h3 style={{ marginLeft: '.8rem', color: 'grey' }}>Masterdish Details</h3>

        {loading ? (
          <Loader />
        ) : (
          <>
            <TableContainer component={Paper}>

              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Masterdish Name</TableCell>
                    <TableCell align="center">Masterdish Image</TableCell>
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
                    details.map((row) => (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.masterDishName}>
                        <TableCell align="center">
                          {row.masterDishName.length > 20 ? (
                            <Tooltip title={row.masterDishName}>
                              <span>
                                {`${row.masterDishName.substring(0, 20)}...`}
                              </span>
                            </Tooltip>
                          ) : (
                            <span>{row.masterDishName}</span>
                          )}

                        </TableCell>
                        <TableCell align="center">
                          <img
                            src={`${serverConfig.API_URL}/${row.masterDishImage}`}
                            style={{
                              maxWidth: '150px',
                              width: '10rem',
                              height: '5rem',
                              borderRadius: '11%',
                              margin: 'auto',
                              verticalAlign: 'middle',
                            }}
                            alt=""
                          />
                        </TableCell>
                        <TableCell align="center">
                          <CreateIcon style={{ color: 'grey', cursor: 'pointer' }} onClick={() => editMasterdish(row.id, row.masterDishName, row.masterDishImage)} />
                          <DeleteIcon style={{ color: 'grey', marginLeft: '1rem', cursor: 'pointer' }} onClick={() => deleteMasterDish(row.id)} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange}
                color="primary" shape="rounded"
              />
            </div>
          </>
        )}
        <Dialog open={openMasterdish} fullWidth>
          <DialogTitle>Add Masterdish Details</DialogTitle>
          <DialogContent style={{ display: 'grid', flexDirection: 'column', alignItems: 'center' }}>
            <DialogContentText>
              You can add Masterdish from here
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Dish Name*"
              type="text"
              fullWidth
              variant="standard"
              value={masterdishname}
              onChange={handleDishNameChange}
            />
            <span className='errorShow' style={{ color: 'red', marginRight: '5.3rem' }}>{masterdishNameError}</span>
            <p className='addshopTexts' style={{ marginRight: '4rem' }}> Upload Masterdish Image*</p>
            {selectedImage && (
              <div style={{ marginRight: '4rem' }}>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected Img"
                  style={{ width: '10rem', height: '5rem', borderRadius: '11%', verticalAlign: 'middle', marginRight: '2rem' }}
                />
                <Button onClick={handleCancelImage} style={{ marginTop: '1rem', marginRight: '4rem' }}>Cancel Image</Button>
              </div>
            )}
            {!selectedImage && (
              <div>
                <input type='file' onChange={handleImageChange} />
              </div>
            )}
          </DialogContent>
          <span className='errorShow' style={{ color: 'red', marginLeft: '1.5rem', marginTop: '-20px' }}>  {imgError || ImgEr || addDisherror}</span>
          <DialogActions>
            <Button onClick={close} >Cancel</Button>
            <Button onClick={() => { addMasterdish() }} >Proceed</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openEditmasterdish} fullWidth>
          <DialogTitle>Edit Masterdish Details</DialogTitle>
          <DialogContent style={{ display: 'grid', flexDirection: 'column', alignItems: 'center' }}>
            <DialogContentText>
              You can edit Masterdish from here
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Dish Name*"
              type="text"
              fullWidth
              variant="standard"
              value={editMDname}
              onChange={handleEditDishNameChange}
            />
            <span className='errorShow' style={{ color: 'red', marginRight: '5.3rem' }}>{masterdishNameError}</span>
            <p className='addshopTexts'> Upload Masterdish Image*</p>

            {typeof editMDImg === 'string' && (
              <div style={{ marginLeft: '-3px' }}>
                <img
                  src={`${serverConfig.API_URL}/${editMDImg}`}
                  alt="Selected Img"
                  style={{ width: '10rem', height: '5rem', borderRadius: '11%', verticalAlign: 'middle' }}
                />
                <Button onClick={handleCandelEditImage} style={{ marginTop: '1rem', marginLeft: '-0.1rem' }}>Cancel Image</Button>
              </div>
            )}
            {editImg && (
              <div>
                <img
                  src={URL.createObjectURL(editImg)}
                  alt="Selected Img"
                  style={{ width: '10rem', height: '5rem', borderRadius: '11%', verticalAlign: 'middle' }}
                />
                <Button onClick={handleCandelEditImage} style={{ marginTop: '1rem', marginLeft: '-0.4rem' }}>Cancel Image</Button>
              </div>
            )}
            {typeof editMDImg !== 'string' && !editImg && (
              <div>

                <input type='file' onChange={handleNewImageChange} />
              </div>
            )}
          </DialogContent>
          <span className='errorShow' style={{ color: 'red', marginLeft: '1.5rem', marginTop: '-20px' }}>{imgError || ImgEr || addDisherror}</span>
          {/* <span className='errorShow' style={{ color: 'red', marginLeft: '1.5rem' }}>{ImgEr}</span>
            <span className='errorShow' style={{ color: 'red', marginLeft: '1.5rem' }}>{addDisherror}</span>
            <span className='errorShow' style={{ color: 'red', marginLeft: '1.5rem' }}>{unsupportedImage}</span> */}

          <DialogActions>
            <Button onClick={close} >Cancel</Button>
            <Button onClick={() => { updateMasterdish(editID) }} disabled={!hasChanges || hasError}>Proceed</Button>
          </DialogActions>
        </Dialog>
      </div>

    </div>
  );
}

export default Masterdish;

