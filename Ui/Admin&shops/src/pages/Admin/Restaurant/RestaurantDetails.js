import * as React from 'react';
import Table from '@mui/material/Table';
import AddIcon from '@mui/icons-material/Add';
import TableBody from '@mui/material/TableBody';
import serverConfig from '../../../services/serverConfig'

// import './Package.css'
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableHead from '@mui/material/TableHead';
import { Icon } from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import DeleteIcon from '@mui/icons-material/Delete';
import './RestaurantDetails.css'
import toastConfig from '../../../utils/toastConfig'
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Import toastr CSS (optional, for styling)
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { Button, Pagination } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { AddShop, getShops, EditShopDetails,deleteShop } from 'src/services/AdminServices';
import Loader from '../../../utils/Loader/loader'
import Tooltip from '@mui/material/Tooltip';
export default function RestaurantDetails() {
  const [setOpen] = React.useState(false);
  const [addPackage, setAddPackage] = React.useState(false);
  const [editShop, setEditShop] = React.useState(false);
  const [details, setDetails] = useState([])
  //Add New shop 
  const [email, setEmail] = useState('')
  // const [shopPassword, setShopPassword] = useState('')
  const [shopNumber, setShopNumber] = useState('')
  const [files, setNewImg] = useState('')
  const [shopName, setShopName] = useState('')
  const [shopAddress, setShopAddress] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  //Edit shop
  const [eShopId, setShopIds] = useState('')
  const [nshopName, setNewShopName] = useState('')
  const [nshopImg, setNewShopImage] = useState('');
  const [nshopAddress, setNewShopAddress] = useState('')
  const [nshopNumber, setNewShopNumber] = useState('')
  const [nstartTime, setNewStartTime] = useState('')
  const [nendTime, setNewEndTime] = useState('')
  const [newShopImg, setNewShopEditImage] = useState(null)

  // Add state variables for field errors
  const [emailError, setEmailError] = useState('');
  const [shopNameError, setShopNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('')
  const [shopAddressError, setShopAddressError] = useState('')
  const [starttimeError, setStartImeError] = useState('')
  const [endtimeError, setEndTimeError] = useState('')
  const [error, setError] = useState('');
  const [shopAddError, setShopAddError] = useState('')
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [success,setIsSuccess] = useState(false);
  const [addShop, setSuccessAddShop] = useState(false)
  const [hasChanges, setHasChanges] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ImgEr,setImageError] = useState('')
  const [unsupportedImage,setUnsupportedImage] = useState('')
  // State for the newly selected image (while editing or adding a new shop)
  // const [newShopImage, setNewShopImages] = useState(null);
  //regex for password
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,255}$/;
  const [selectedImage, setSelectedImage] = useState(null);
  //Loading
  const [loading, setLoading] = useState(true);

  const handleNewImageChange = (event) => {
    setHasChanges(false);
    const EditImg = event.target.files;

    const file = event.target.files[0];
    setNewShopEditImage(file);
  
    if (file) {
      const fileFormat = file.name.split('.').pop().toUpperCase();
      const allowedFormats = ['JPEG', 'JPG', 'PNG' , 'GIF'];
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
   
        validateImagee(EditImg);
        setNewImg(EditImg);
        setError('');
      }
    } else {
      setHasError(false); // Set hasError to false when there is no error
      setError('');
    }
  };

  const handleImageChange = (event) => {
    const mew1 = event.target.files;
    setNewImg(mew1);
   
    const file = event.target.files[0];

    // const isImageValid =  // Check if the image is valid
    setSelectedImage(file);
    setError('');
  
    if (file ) {
      const fileFormat = file.name.split('.').pop().toUpperCase();
      const allowedFormats = ['JPEG', 'JPG', 'PNG' , 'GIF'];
      const allowedSize = 2; // in MB
  
      if (!allowedFormats.includes(fileFormat)) {
        setError('Invalid Image! Please select a PNG, JPG,GIF or JPEG file.');
      } else if (file.size / 1024 / 1024 > allowedSize) {
        setError(`Invalid Image! File size exceeds ${allowedSize} MB.`);
      } else {
        setError('')
        console.log(file);
      }
    }
  };
  const handleCancelImage = () => {
    setNewImg('')
    setSelectedImage(null);
    setError(false)
    setNewShopEditImage(null)
    setShopAddError('')
  };
  const handleCancelEditShopImage = () => {
    setNewShopImage(null)
    setNewShopEditImage(null);
    setError(false)
    setHasChanges(true);

  };
  const deleteRestaurant =async(id)=>{

    try{
     setLoading(true);

      const res = await deleteShop(id);
      if(res.status===200){
        toastr.error('Restaurant deleted!', 'Deleted', toastConfig);
      setTimeout(()=>{
        setLoading(false);   
      fetchShops(currentPage); 
      },2000)

      }else{
        toastr.info('Something went wrong!', 'Info', toastConfig);
      }
    }catch(er){
      setLoading(false);

      return er
    }

  }
  
  useEffect(() => {
 
  }, [nshopImg]);
  const handleCancelNewShopImage = () => {
    setNewShopEditImage(null);
    setNewShopImage(null)
    setError(false)
    setUnsupportedImage('')
  }

  useEffect(() => {
    fetchShops(currentPage);
  }, [currentPage, addShop]);

 const fetchShops = async (page) => {
    try {
      setLoading(true)
      const response = await getShops(page);
      if(response.status === 200){
        setLoading(false)
      }else{
        toastr.info('Something went wrong!', 'Info', toastConfig);
      }
      setDetails(response.data.shops);
      setTotalPages(response.data.totalPages);
     
    } catch (error) {
      setLoading(false); // Also set loading to false in case of an error
    }
  
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const resetForm = () => {
    setEmail('');
    setShopNumber('');
    setNewImg('');
    if (selectedImage) {
      setSelectedImage('');
      setError('');
    }
    if (newShopImg) {
      setNewShopEditImage('')
      setError('')
    }
    setShopName('');
    setShopAddress('');
    setStartTime('');
    setEndTime('');
    setEmailError('');
    setShopAddress('');
    setShopNameError('');
    setPhoneNumberError('')
    setShopAddressError('')
    setStartImeError('')
    setEndTimeError('')
    setShopAddError('')
    setImageError('')
  };
  function generateRandomPassword() {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_-+=[]{}|:;<>,.?';
    const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars;
    let password = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }
    // Make sure the password contains at least one lowercase, one uppercase, one number, and one special character
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_\-=\[\]{}|:;<>,.?]/.test(password);
    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar) {
      // If any requirement is not met, generate the password again
      return generateRandomPassword();
    }
    return password;
  }
  const handleEditShop = async () => {
    const isShopNameValid = validteShopName(nshopName);
    const isPhoneNumberValid = validatePhoneNumber(nshopNumber);
    const isShopAddressValid = validateShopAddress(nshopAddress);
    const isShopStartTimeValid = validateStartTime(nstartTime);
    const isShopEndTimeValid = validateEndTime(nendTime);
    const isImageValid = validateImagee(newShopImg || nshopImg)  
    if (isShopNameValid && isPhoneNumberValid && isShopAddressValid && isShopStartTimeValid && isShopEndTimeValid && isImageValid) {
      const data = new FormData();
      data.append('shopName', nshopName);
      data.append('phoneNumber', nshopNumber);
      data.append('address', nshopAddress);
      data.append('startTime', nstartTime);
      data.append('endTime', nendTime);
     
      if (newShopImg) {
        data.append('shopFile', newShopImg);
      }else{
        data.append('shopFile','')
      }
      try {
        const response = await EditShopDetails(eShopId, data, 'multipart');
   if(response){
    setLoading(true)
   }
        if (response.status === 200) {
           setLoading(false)
          setEditShop(false); // Close the Edit Shop dialog
          setSuccessAddShop(true);
          fetchShops(currentPage);
          setIsSuccess(true);
          resetForm();
          setHasChanges(false);
          // Show success toast message
     toastr.success('Shop updated successfully!', 'Success', toastConfig);
        } else {
          // Show error toast message
     toastr.error('Failed to update shop!', 'Error', toastConfig);
        }
      } catch (error) {
 
        if(error.response.data.message === 'Unsupported file format. Only JPEG, JPG, PNG, and GIF images are allowed.'){
          setUnsupportedImage('Image format corruption/invalid.Change it')
        }else{
          toastr.info('Something went wrong!', 'Info', toastConfig);

        }

        setLoading(false)
        // Handle any errors that occurred during the request
        // Show error toast message
     toastr.error('An error occurred while updating the shop!', 'Error', toastConfig);
        
      }
    }
  };
  async function addNewShop(ev) {
    const randomPassword = generateRandomPassword();
    const isEmailValid = validateEmail(email);
    const isShopNameValid = validteShopName(shopName);
    const isShopNumberValid = validatePhoneNumber(shopNumber);
    const isShopAddressValid = validateShopAddress(shopAddress);
    const isShopStartTimeValid = validateStartTime(startTime);
    const isShopEndTimeValid = validateEndTime(endTime);

    const isImageisValid = validateImage( files[0])
     const hasError = !!error;
    if (
      isEmailValid &&
      isShopNameValid &&
      isShopNumberValid &&
      isShopAddressValid &&
      isShopStartTimeValid &&
      isShopEndTimeValid && isImageisValid && !hasError
    ) {
      try {
        const data = new FormData();
        data.append('email', email);
        data.append('password', randomPassword);
        data.append('phoneNumber', shopNumber);
        data.append('shopName', shopName);
        data.append('address', shopAddress);
        data.append('startTime', startTime);
        data.append('endTime', endTime);
        if (files[0]) {
          data.append('shopFile', files[0]);
        }else{
          data.append('shopFile','')
        }
        const response = await AddShop(data, 'multipart');
        if(response){
          setLoading(true)
         }
        if (response.status === 200) {
    setLoading(false)
          setLoading(false)
          setAddPackage(false);
          setSuccessAddShop(true);
          fetchShops(currentPage);
          setCurrentPage(1);
          setIsSuccess(true);
          resetForm();
          toastr.success('Shop added successfully!', 'Success', toastConfig);
        } else{
          toastr.info('Something went wrong!', 'Info', toastConfig);

        }
      } catch (error) {
        setLoading(false)
     toastr.error('An error occurred while adding the shop!', 'Error', toastConfig);

     
        // Handle errors that occurred during the request
        if (error.response) {
          if (error.response.data.message === 'Email already registered') {
            setShopAddError(error.response.data.message);
          } else if (
            error.response.data.message === 'Unsupported file format. Only JPEG, JPG, PNG, and GIF images are allowed.'
          ) {
            setShopAddError('Image format corruption/invalid.Change it');
          } else {
            // Handle other types of errors if needed
            setShopAddError('An error occurred during shop registration.');
          }
        } else {
          // Handle other types of errors if needed
          setShopAddError('An error occurred during shop registration.');
        }
      }
    }
  }
  const handleKeyPress = (e) => {
    const validKeys = /^[0-9\b]+$/; // Regular expression to allow only numbers and backspace (\b) key
    if (!validKeys.test(e.key)) {
      e.preventDefault();
    }else{
  console.log(e);
    }
  };
  const handletime = (e) => {
    const validKeys = /^[0-9\b]+$/; // Regular expression to allow only numbers and backspace (\b) key
    if (!validKeys.test(e.key)) {
      e.preventDefault();
    }else{
      console.log(e);
    }
  
    // Limit the input to 2 digits and restrict the hours to 24
    const inputValue = e.target.value + e.key;
    if (inputValue > 24) {
      e.preventDefault();
    }
  };
  const handleEmailChange = (e) => {
    const emailValue = e.target.value
    setEmail(emailValue);
    setShopAddError('')
    if (!emailValue) {
      setEmailError('Email is required');
    } else {
      setEmailError(validateEmail(emailValue) ? '' : 'Invalid email address');
    }
  };
  const handleShopNumberChange = (e) => {
    const phoneNumberValue = e.target.value;
    setShopNumber(phoneNumberValue);
    validatePhoneNumber(phoneNumberValue);
  };
  const handleEditShopNumber = (e) => {
    const phoneNumberValue = e.target.value;
    setNewShopNumber(phoneNumberValue);
    validatePhoneNumber(phoneNumberValue);
    setHasChanges(true);
  };
  const handleShopNameChange = (e) => {
    const shopNameValue = e.target.value;
    setShopName(shopNameValue);
    validteShopName(shopNameValue);
  };
  const handleEditShopNameChange = (e) => {
    const shopNameValue = e.target.value;
    setNewShopName(shopNameValue);
    validteShopName(shopNameValue);
    setHasChanges(true);
  };
  const handleShopAddressChange = (e) => {
    const shopAddressValue = e.target.value;
    setShopAddress(shopAddressValue);
    validateShopAddress(shopAddressValue);
  };
  const handleEditShopAddressChange = (e) => {
    const shopAddressValue = e.target.value;
    setNewShopAddress(shopAddressValue);
    validateShopAddress(shopAddressValue);
    setHasChanges(true);
  };
  const handleStartTimeShop = (e) => {
    const shopstartTimevalue = e.target.value;
    setStartTime(shopstartTimevalue)
    validateStartTime(shopstartTimevalue)
  }
  const handleEditStartTimeShop = (e) => {
    const shopstartTimevalue = e.target.value;
    setNewStartTime(shopstartTimevalue)
    validateStartTime(shopstartTimevalue)
    setHasChanges(true);
  }
  const handleEndTimeShop = (e) => {
    const shopendTimeValue = e.target.value;
    setEndTime(shopendTimeValue)
    validateEndTime(shopendTimeValue)
  }
  const handleEditEndTimeShop = (e) => {
    const shopendTimeValue = e.target.value;
    setNewEndTime(shopendTimeValue)
    validateEndTime(shopendTimeValue)
    setHasChanges(true);
  }
  const validateEmail = (emailValue) => {
    if (!emailValue) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(emailValue)) {
      setEmailError('Invalid email format');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };
  const validteShopName = (shopNameValue) => {
    const whitespaceRegex = /\s{2,}/
    if (!shopNameValue) {
      setShopNameError('Shop Name is required');
      return false;
    } else if (shopNameValue.length > 25) {
      setShopNameError('Shop Name must be at most 25 characters long');
      return false;
    }
    else if (whitespaceRegex.test(shopNameValue)) {
      setShopNameError('Only one space is allowed between words/black space');
      return false;
    }
    else {
      setShopNameError('');
      return true;
    }
  };
  const validatePhoneNumber = (phoneNumberrValue) => {
    if (!phoneNumberrValue) {
      setPhoneNumberError('Phone number is required');
      return false;
    }
    else if (phoneNumberrValue.length < 10) {
      setPhoneNumberError('Phone number must be at least 10 numbers long');
      return false;
    } 
     else if (phoneNumberrValue.length > 12) {
      setPhoneNumberError('Phone number must be at most 12 numbers long');
      return false;
    } else {
      setPhoneNumberError('');
      return true;
    }
  };

  const validateStartTime = (shopstartTimevalue) => {
    if (!shopstartTimevalue) {
      setStartImeError('Shop start time is required')
    }
    else {
      setStartImeError('')
      return true;
    }
  }

  const validateImage = (file) => {
    if (!file) {
      setError('Image is required.');
      return false;
    }else{
  
    // setError(''); // Clear any previous error messages if image is valid
    return true;
  }};
  const validateImagee = (filee) => {
    if (!filee) {
      setError('Image is required.');
      return false;
    }else{
  
    // setError(''); // Clear any previous error messages if image is valid
    return true;
  }};
  const validateEndTime = (shopEndTimeValue) => {
    if (!shopEndTimeValue) {
      setEndTimeError('Shop end time is required');
      return false;

    } else {
      setEndTimeError('');
    }
    return true;
  };
  const validateShopAddress = (shopAddressValue) => {
    const whitespaceRegex = /\s{2,}/
    if (!shopAddressValue) {
      setShopAddressError('Shop Address is required');
      return false;
    }
    else if (shopAddressValue.length > 50) {
      setShopAddressError('Shop Address must be at most 50 characters long');
      return false;
    }
    else if (whitespaceRegex.test(shopAddressValue)) {
      setShopAddressError('Only one space is allowed between words/black space');
      return false;
    }
    else {
      setShopAddressError('');
      return true;
    }
  };
  function openAddpackages() {
  
    setAddPackage(true)
  }
  const close = () => {
   
    setIsSuccess(false);
    setAddPackage(false);
    
    setError('')
    resetForm()
  };
  const closeEditShop = () => {

    setIsSuccess(false);
    setUnsupportedImage('')
    setEditShop(false);
    resetForm()
    setHasChanges(false);
    setError('')
  };
  const handleClose = () => {
    setOpen(false);
    // resetForm()
  };
  function editShopDetails(selectedId, shopname, shopimage, address, phonenumber, startime, endtime) {
    setShopIds(selectedId)
    setNewShopName(shopname);
    setNewShopImage(shopimage);
    if(shopimage){
      setImageError('')
    }
    setNewShopAddress(address);
    setNewShopNumber(phonenumber)
    setNewStartTime(startime)
    setNewEndTime(endtime)
    setEditShop(true)
  }

  return (
    <div>
   
        <>
          <Button variant='outlined' style={{ float: 'right', marginBottom: '0rem',marginTop:'-7px' }} onClick={() => openAddpackages()} ><AddIcon />Add</Button>
          <h3 style={{ marginLeft: '.8rem', color: 'grey' }}>Restaurant Details </h3>
          {loading ? (
        // Show the loader component when loading is true
        <Loader />
      ) : (
        <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: '150px' }}>Shop Name</TableCell>
                    <TableCell align="center">Shop Email</TableCell>
                    <TableCell align="center" >Image</TableCell>
                    <TableCell align="center">Shop Address</TableCell>
                    <TableCell align="center">Shop Number</TableCell>
                    <TableCell align="center">Start time(H)</TableCell>
                    <TableCell align="center">End time(H)</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {details.length === 0 ? ( // Check if filteredData is empty
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* <img src='' alt="No Data Found" style={{ width: '200px', height: '200px' }} /> */}
                    <span>No data found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
                  details.map((row) => (
                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center">
                      {row.shopName.length > 20 ? (
              <Tooltip title={row.shopName}>
                <span>
                  {`${row.shopName.substring(0, 20)}...`}
                </span>
              </Tooltip>
            ) : (
              <span>{row.shopName}</span>
            )}

                      </TableCell>
                      <TableCell align="center">
                      {row.email.length > 20 ? (
              <Tooltip title={row.email}>
                <span>
                  {`${row.email.substring(0, 20)}...`}
                </span>
              </Tooltip>
            ) : (
              <span>{row.email}</span>
            )}

                      </TableCell>
                      <TableCell align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                        
                          <img
                         src={`${serverConfig.API_URL}/${row.shopImage}`}
                            style={{ maxWidth: '150px', width: '10rem', height: '5rem', borderRadius: '11%', verticalAlign: 'middle' }}
                            alt="" 
                          />      
                      </TableCell>
                      <TableCell align="center">
            {row.address.length > 20 ? (
              <Tooltip title={row.address}>
                <span>
                  {`${row.address.substring(0, 20)}...`}
                </span>
              </Tooltip>
            ) : (
              <span>{row.address}</span>
            )}
          </TableCell>
                      <TableCell align="center">{row.phoneNumber}</TableCell>
                      <TableCell align="center">{row.startTime}</TableCell>
                      <TableCell align="center">{row.endTime}</TableCell>
  <TableCell align="center">
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0px' }}>
      <Icon style={{ color: 'grey', cursor: 'pointer' }} onClick={() => editShopDetails(row.id, row.shopName, row.shopImage, row.address, row.phoneNumber, row.startTime, row.endTime)} path={mdiPencil} size={1} />
      <DeleteIcon style={{ color: 'grey', cursor: 'pointer', marginLeft: '20px' }} onClick={()=>deleteRestaurant(row.id)}   />
    </div>
  </TableCell>
                      
                    </TableRow>
                    ))
  )}
                </TableBody>
              </Table>
             
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                />
              </div>
     </> )}
          <Dialog open={editShop} onClose={handleClose} fullWidth>
            <DialogTitle>Edit Restaurant Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You can edit restaurents from here
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Phone Number*"
                type="number"
                value={nshopNumber}
                onChange={handleEditShopNumber}
                fullWidth
                variant="standard"
                onKeyPress={handleKeyPress}
              />
              <span className='errorShow' >{phoneNumberError}</span>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Shop Name*"
                type="text"
                value={nshopName}
                onChange={handleEditShopNameChange}
                fullWidth
                variant="standard"
              />
              <span className='errorShow'>{shopNameError}</span>

              <p className='addshopTexts'> Upload Shop Image*</p>

              {typeof nshopImg === 'string' && (
                <div style={{marginLeft:'-3px'}}>
                  <img
                src={`${serverConfig.API_URL}/${nshopImg}`}
                    alt="Selected Img"
                    style={{ width: '10rem', height: '5rem', borderRadius: '11%', verticalAlign: 'middle' }}
                  />
                  <Button onClick={handleCancelEditShopImage} style={{ marginTop: '1rem', marginLeft: '-0.4rem' }}>Cancel Image</Button>
                </div>
              )}
              {newShopImg && (
                <div>
                  <img
                    src={URL.createObjectURL(newShopImg)}
                    alt="Selected Img"
                    style={{ width: '10rem', height: '5rem', borderRadius: '11%', verticalAlign: 'middle' }}
                  />
                  <Button onClick={handleCancelNewShopImage} style={{ marginTop: '1rem', marginLeft: '-0.4rem' }}>Cancel Image</Button>
                </div>
              )}
              {typeof nshopImg !== 'string' && !newShopImg && (
                <div>
                  <input type='file' onChange={handleNewImageChange} />
                </div>
              )}
              {error && (
                <div className='errorShow'>
                  {error}
                </div>)}
                {ImgEr && (
                <div className='errorShow'>
                  {ImgEr}
                </div>)}
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Shop Address*"
                type="text"
                value={nshopAddress}
                onChange={handleEditShopAddressChange}
                fullWidth
                variant="standard"
              />
              <span className='errorShow'>{shopAddressError}</span>
             
            
              <div style={{ display: 'inline-block', marginRight: '1rem' }}>
                <label className='addshopTexts' >Start Time*</label>
                <br />
                <TextField
                  autoFocus
                  margin="dense"
                  id="start-time"
                  value={nstartTime}
                  onChange={handleEditStartTimeShop}
                  type="text"
                  variant="standard"
                  onKeyPress={handletime}
                />
              </div>
        
              <span className='errorShow'>{starttimeError}</span>
              
              <div style={{ display: 'inline-block', marginLeft: '0rem' }}>
                <label className='addshopTexts'>End Time*</label>
                <br />
                <TextField
                  autoFocus
                  margin="dense"
                  id="end-time"
                  type="text"
                  value={nendTime}
                  onChange={handleEditEndTimeShop}
                  variant="standard"
                  onKeyPress={handletime}
                />
              </div>
              <br />
              <span className='errorShow'>{endtimeError}</span>
            </DialogContent>
            <span className='errorShow' style={{ color: 'red', marginLeft: '1.5rem' }}>{unsupportedImage}</span>
            <DialogActions>
              <Button onClick={closeEditShop} >Cancel</Button>
              <Button onClick={() => { handleEditShop() }} disabled={!hasChanges || hasError}>Proceed</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={addPackage} onClose={handleClose} disableBackdropClick fullWidth>
            <DialogTitle>Add Restaurant Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You can add restaurents from here
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email*"
                type="text"
                fullWidth
                variant="standard"
                value={email}
                onChange={handleEmailChange}
              />
              <span className='errorShow'>{emailError}</span>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Phone Number*"
                type="number"
                value={shopNumber}
                onChange={handleShopNumberChange}
                fullWidth
                variant="standard"
                onKeyPress={handleKeyPress}
              />
              <span className='errorShow'>{phoneNumberError}</span>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Shop Name*"
                type="text"
                value={shopName}
                onChange={handleShopNameChange}
                fullWidth
                variant="standard"
              />
              <span className='errorShow'>{shopNameError}</span>
              <p className='addshopTexts'> Upload Shop Image*</p>
              {selectedImage && (
                <div>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Img"
                    style={{ width: '10rem', height: '5rem', borderRadius: '11%', verticalAlign: 'middle' }}
                  />
                  <Button onClick={handleCancelImage} style={{ marginTop: '1rem' }}>Cancel Image</Button>
                </div>
              )}
              {!selectedImage && (
                <div>
                  <input type='file' onChange={handleImageChange} />
                </div>
                
              )}
              <div className='errorShow'>
    {error || ImgEr}
  </div>

{/* Show error if it exists */}

                
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Shop Address*"
                type="text"
                value={shopAddress}
                onChange={handleShopAddressChange}
                fullWidth
                variant="standard"
              />
              <span className='errorShow'>{shopAddressError}</span>
      
              <div style={{ display: 'inline-block', marginRight: '1rem' }}>
                <label className='addshopTexts' >Start Time*</label>
                <br />
                <TextField
                  autoFocus
                  margin="dense"
                  id="start-time"
                  value={startTime}
                  onChange={handleStartTimeShop}
                  type="text"
                  variant="standard"
                  onKeyPress={handletime}
                />
              </div>
              <br />
              <span className='errorShow'>{starttimeError}</span>
 
              <div style={{ display: 'inline-block', marginLeft: '0rem' }}>
                <label className='addshopTexts'>End Time*</label>
                <br />
                <TextField
                  autoFocus
                  margin="dense"
                  id="end-time"
                  type="text"
                  value={endTime}
                  onChange={handleEndTimeShop}
                  variant="standard"     
                  onKeyPress={handletime}

                  inputProps={{ step: 300 }}         
                />
              </div>
              <br />
              
              <span className='errorShow'>{endtimeError}</span>
            </DialogContent>
            <span className='errorShow' style={{  marginLeft: '1.5rem' }}>{shopAddError}</span>
         
         
            <DialogActions>
              <Button onClick={close} >Cancel</Button>
              <Button onClick={() => { addNewShop() }} >Proceed</Button>
            </DialogActions>
          </Dialog>
        </>
    
    </div>
  )
}