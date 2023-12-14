import PropTypes from "prop-types"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box } from '@mui/material'
import loginStyles from './login.module.css'
import { Userlogin } from "../../../services/apiConstants/apiServices";
import Toaster from "../../../utils/Toster/Toaster";





export default function Login({ onSubmit }) {

  const initialValues = {
    email: "",
    password: ""
  };


  const validationSchema = Yup.object({
    email: Yup.string()
      .required("email is required"),
    password: Yup.string()
      .required("Password is required"),
  });
  const Submit = () => {
    onSubmit(true);
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    Userlogin(values).then((response) => {
      console.log(response.data);
      setSubmitting(false);
      localStorage.setItem('accessToken', response?.data?.accessToken);
      localStorage.setItem('refreshToken', response?.data?.refreshToken)
      localStorage.setItem('profile', JSON.stringify(response.data));
      Submit();
    }).catch((error) => {
      Toaster(error?.response?.data?.message, 38, ["error"])
      console.error(error);
      setSubmitting(false);
    })
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
              <div className={loginStyles.inputDiv}>
                <label className={loginStyles.inputLabel}>
                  Email
                </label>
                <Field
                  name="email"
                  type="text"
                  autocomplete="off"
                  className={loginStyles.inputFeild}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={loginStyles.errorMsg}
                />
              </div>
              <div className={loginStyles.inputDiv}>
                <label className={loginStyles.inputLabel}>
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  autocomplete="off"
                  className={loginStyles.inputFeild}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={loginStyles.errorMsg}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={loginStyles.subButton}
              >
                <span className="inline-block mr-2">Login</span>
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

Login.propTypes = {
  onSubmit: PropTypes.func
}



