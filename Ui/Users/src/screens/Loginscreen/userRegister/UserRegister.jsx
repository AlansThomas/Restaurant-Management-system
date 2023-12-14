import PropTypes from "prop-types"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box, Typography } from '@mui/material'
import registerStyles from './userRegister.module.css'
import { userRegister } from "../../../services/apiConstants/apiServices";
import { useState } from "react";
import { red } from "@mui/material/colors";




export default function UserRegister({ onSubmit }) {
  const initialValues = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    refferalCode: ""
  };


  const validationSchema = Yup.object({
    userName: Yup.string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username cannot exceed 20 characters")
      .matches(
        /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
        "Invalid characters in the username"
      )
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .matches(/^\S*$/, "Password cannot contain spaces")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/^\S*$/, "Password cannot contain spaces")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    refferalCode: Yup.string()
  });
  const Submit = () => {
    onSubmit(true);
  }

  const [errorReg, setErrorReg] = useState('')
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...filteredValues } = values;
      await userRegister(filteredValues);
      setSubmitting(false);
      Submit(); // Call the Submit function when the form submission is successful
    } catch (error) {
      console.error(error);
      setErrorReg(error.response.data.message)
      console.log("qq", error.response.data.message);
      setSubmitting(false); // Stop the form submission
      // You can show an error message to the user if needed
    }
  };




  return (
    <>
      <Box sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: 'fit-content',
        minHeight: 400,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0px 20px 0px'
      }}
      >

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}

        >
          {({ isSubmitting }) => (
            <Form style={{ width: '50%' }}>
              <div className={registerStyles.inputDiv}>
                <label className={registerStyles.inputLabel}>
                  Name
                </label>
                <Field
                  name="userName"
                  type="text"
                  autocomplete="off"
                  className={registerStyles.inputFeild}
                />
                <ErrorMessage
                  name="userName"
                  component="div"
                  className={registerStyles.errorMsg}
                />
              </div>

              <div className={registerStyles.inputDiv}>
                <label className={registerStyles.inputLabel}>
                  E-mail
                </label>
                <Field
                  name="email"
                  type="email"
                  autocomplete="off"
                  className={registerStyles.inputFeild}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={registerStyles.errorMsg}
                />
              </div>
              <div className={registerStyles.inputDiv}>
                <label className={registerStyles.inputLabel}>
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  autocomplete="off"
                  className={registerStyles.inputFeild}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={registerStyles.errorMsg}
                />
              </div>
              <div className={registerStyles.inputDiv}>
                <label className={registerStyles.inputLabel}>
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className={registerStyles.inputFeild}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={registerStyles.errorMsg}
                />
              </div>

              <div className={registerStyles.inputDiv}>
                <label className={registerStyles.inputLabel}>
                  Refferal code
                </label>
                <Field
                  name="refferalCode"
                  type="text"
                  className={registerStyles.inputFeild}
                />
                <ErrorMessage
                  name="refferalCode"
                  component="div"
                  className={registerStyles.errorMsg}
                />
              </div>
              <Typography sx={{ color: red }}>{errorReg}</Typography>
              <button
                type="submit"
                disabled={isSubmitting}
                className={registerStyles.subButton}
              >
                <span className="inline-block mr-2">Register</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </Form>
          )}
        </Formik>



      </Box>
    </>
  )
}

UserRegister.propTypes = {
  onSubmit: PropTypes.func
}



