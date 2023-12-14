import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
import { userLogin } from 'src/services/AdminServices';


export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
 
  const [apiError, setApiError] = useState(''); 
 
  function isLoginFormValid() {
    return email.trim() !== '' && password.trim() !== '';
  }
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear the apiError when the user makes changes to the email 
    setApiError('');
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear the apiError when the user makes changes to the  password
    setApiError('');
  };
  async function login() {

      try {
        const requestBody = { email, password };
        const response = await userLogin(requestBody);
  
        console.log('response', response);
        localStorage.setItem('AccessToken', response.data.accessToken);
        localStorage.setItem('refreshToken',response.data.refreshToken)

        if (response.data.role === 0) {
          navigate('/dashboard/app');
        }
        if(response.data.role === 1){
          setApiError("Un-Authorized Access")
        }
      } catch (error) {
        console.log('Error logging in:', error);
    
        setApiError(error.response?.data.message || 'An error occurred while logging in.');
        
        // Handle error
      }
    }
  

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          value={email}
          onChange={handleEmailChange}
          // onBlur={(e) => validateEmail(e.target.value)} // Run validation when focus leaves the email field
          id="standard-basic"
          label="Enter your email address"
          error={Boolean(emailError)}
          helperText={emailError}
          InputLabelProps={{ shrink: true }}  
        />

        <TextField
          value={password}
          onChange={handlePasswordChange}
          // onBlur={(e) => validatePassword(e.target.value)} // Run validation when focus leaves the password field
          id="standard-basic"
          label="Enter your password"
          name="password"
          type={showPassword ? 'text' : 'password'}
        
          InputLabelProps={{ shrink: true }}  
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
   

      {apiError && <div style={{ color: 'red' }}>{apiError}</div>}
      <LoadingButton style={{marginTop:'1rem'}}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={login}
        disabled={!isLoginFormValid()} // Disable the button when email or password is empty
      >
        Login
      </LoadingButton>
    </>
  );
}
