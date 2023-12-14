import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
import { shopLogin } from 'src/services/AdminServices';


// Regular expressions
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;


export default function LoginFormShop() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const [apiError, setApiError] = useState(''); 

  function isLoginFormValid() {
    return email.trim() !== '' && password.trim() !== '';
  }

  async function login() {

      try {
        const requestBody = { email, password };
        const response = await shopLogin(requestBody);
  
        console.log('response', response);
        localStorage.setItem('AccessToken', response.data.accessToken);
        localStorage.setItem('refreshToken',response.data.refreshToken)
        localStorage.setItem('shopStatus',response.data.shopStatus)

        if (response.status === 200) {
          navigate('/shopsDashboard');
        }
      } catch (error) {
        console.log('Error logging in:', error);
        setApiError(error.response?.data.message || 'An error occurred while logging in.');
  
      }
    }
  

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // onBlur={(e) => validateEmail(e.target.value)} // Run validation when focus leaves the email field
          id="standard-basic"
          label="Enter your email address"
          error={Boolean(emailError)}
          helperText={emailError}
          InputLabelProps={{ shrink: true }}  
        />

        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // onBlur={(e) => validatePassword(e.target.value)} // Run validation when focus leaves the password field
          id="standard-basic"
          label="Enter your password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          // error={Boolean(passwordError)}
          // helperText={passwordError}
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
   

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" /> */}
        <Link variant="subtitle2" underline="hover">
          Forgot password??
        </Link>
      </Stack>
      {apiError && <div style={{ color: 'red' }}>{apiError}</div>}
      <LoadingButton style={{marginTop:'1rem'}}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={login}
        disabled={!isLoginFormValid()}
        // disabled={Boolean(emailError) || Boolean(passwordError)} // Disable the button when there are validation errors
      >
        Login
      </LoadingButton>
    </>
  );
}
