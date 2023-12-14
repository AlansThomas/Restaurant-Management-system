import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Modal, Typography } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { getMasterDishes, postDishes, postOffers } from 'src/services/apiConstants/apiServices';
import * as Yup from "yup";
import toastConfig from '../../../utils/toastConfig'
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import dishStyles from "./MasterDishes.module.css";


function MasterDishes() {

  const [masterDishes, setMasterDishes] = useState([])
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false)
  const [file, setFile] = useState("")
  const Navigate = useNavigate();

  const [masterdishId, setdishId] = useState();


  const handleOpen = (id) => {
    setdishId(id)
    setOpen(true);
  };

  const dishView = (id) => {
    Navigate(`/shopsDashboard/MasterDishes/dishes?mange=${id}`);
  };

  const handleClose = () => {
    setOpen(false);
    setdishId('')
  };

  const fileUpload = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0])
  }

  const listMasterDishes = () => {
    getMasterDishes().then((res) => {
      console.log(res);
      setMasterDishes(res?.data?.masterDish)
    }).catch((err) => {
      console.error(err);
    })

  }


  const handleAddDish = (id) => {
    setShow(true);
    setdishId(id)
  };

  const handleAddDishClose = () => {
    setShow(false);
    setdishId('')
  };

  const initialValues = {
    offerName: "",
    description: "",
    startDate: "",
    endDate: "",
    discount: "",
  };


  const Values = {
    dishName: "",
    discription: "",
    price: "",
    dishQuantity: "",
    categoryStatus: "",
  };

  const validationSchema = Yup.object({
    offerName: Yup.string()
      .min(3, "Offer name must be at least 3 characters long")
      .max(150, "Offer name cannot exceed 150 characters")
      .matches(
        /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
        "Invalid characters in the Offer name"
      )
      .required("Offer name is required"),
    description: Yup.string()
      .min(3, "Description must be at least 3 characters long")
      .max(150, "Description cannot exceed 150 characters")
      .required("Description is required"),
    startDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date cannot be in the past"),

    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),

    discount: Yup.number()
      .required("Discount is required")
      .min(0, "Discount cannot be negative")
      .max(100, "Discount cannot be greater than 100"),
  });


  const validations = Yup.object({
    dishName: Yup.string()
      .min(3, "Dish name must be at least 3 characters long")
      .max(20, "Dish name cannot exceed 20 characters")
      .matches(
        /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
        "Invalid characters in the Dish name"
      )
      .required("Dish name is required"),
    discription: Yup.string()
      .min(3, "Description must be at least 3 characters long")
      .max(50, "Description cannot exceed 20 characters")
      .required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price cannot be negative"),
    dishQuantity: Yup.number()
      .required("Dish quantity is required")
      .min(0, "Dish quantity cannot be negative"),
    categoryStatus: Yup.number()
      .required("Category is required")
  });


  const handleSubmit = (values, { setSubmitting }) => {

    const data = { masterdishId, ...values };
    console.log(data);
    postOffers(data).then((res) => {
      handleClose()
      console.log(res);
    }).catch((err) => {
      console.error(err);
    })

  };


  const handleSubmitDish = (values, { setSubmitting }) => {
    const data = new FormData();
    console.log(file);
    data.append("DishImage", file);
    data.append("masterdishId", masterdishId);
    data.append("dishName", values.dishName)
    data.append("discription", values.discription)
    data.append("price", values.price)
    data.append("dishQuantity", values.dishQuantity)
    data.append("categoryStatus", values.categoryStatus)

    const uploadedFile = data.get("DishImage");
    console.log("Uploaded File:", uploadedFile);

    postDishes(data).then((res) => {
      if(res.status===200){
        console.log("ssd");
        toastr.success('dish Added successfully!', 'Success', toastConfig);
      }
      console.log(res);
      handleAddDishClose();
    }).catch((err) => {
      console.error(err);
    })
  }

  useEffect(() => {
    listMasterDishes()

  }, [])

  return (
    <div>
      <Typography variant='h3'> Master dishes</Typography>
      <div className={dishStyles.dishes}>
        {masterDishes?.map((dish, key) => (
          <div key={key} className={dishStyles.details}>
            <div
              className={dishStyles.imageContainer}
              onClick={() => dishView(dish.id)}
            >
              <img
                src={dish?.masterDishImage}
                alt="Shop"
                className={dishStyles.shpImg}
              />

            </div>
            <p className={dishStyles.shopName} onClick={() => dishView(dish.id)}>{dish?.masterDishName}</p>
            <div className={dishStyles.Button}>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpen(dish?.id)}>Offers</Button>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddDish(dish?.id)}>Dishes</Button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={dishStyles.modal}>
          <h3>
            ADD OFFERS
            <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
          </h3>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >



            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form style={{
                  width: '80%'
                }}
                >
                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Offer name
                    </label>
                    <Field
                      name="offerName"
                      type="text"
                      className={dishStyles.field}
                    />
                    <ErrorMessage
                      name="offerName"
                      component="div"
                      className={dishStyles.error}
                    />
                  </div>

                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Description
                    </label>
                    <Field
                      name="description"
                      type="text"
                      className={dishStyles.field}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className={dishStyles.error}
                    />
                  </div>
                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Start date
                    </label>
                    <Field
                      name="startDate"
                      type="date"
                      className={dishStyles.field}
                    />
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className={dishStyles.error}
                    />
                  </div>
                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      End date
                    </label>
                    <Field
                      name="endDate"
                      type="date"
                      className={dishStyles.field}
                    />
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className={dishStyles.error}
                    />
                  </div>
                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Discount
                    </label>
                    <Field
                      name="discount"
                      type="number"
                      className={dishStyles.field}
                    />
                    <ErrorMessage
                      name="discount"
                      component="div"
                      className={dishStyles.error}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="outlined" sx={{ width: '60%' }}
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={show}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={dishStyles.modal}>
          <h3>
            Add Dishes
            <CloseIcon onClick={handleAddDishClose} style={{ cursor: "pointer" }} />
          </h3>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <Formik
              initialValues={Values}
              validationSchema={validations}
              onSubmit={handleSubmitDish}
            >
              {({ isSubmitting }) => (
                <Form
                  style={{
                    width: '80%'
                  }}>
                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Dish name
                    </label>
                    <Field
                      name="dishName"
                      type="text"
                      className={dishStyles.field} />
                    <ErrorMessage
                      name="dishName"
                      component="div"
                      className={dishStyles.error} />
                  </div>

                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Description
                    </label>
                    <Field
                      name="discription"
                      type="text"
                      className={dishStyles.field} />
                    <ErrorMessage
                      name="discription"
                      component="div"
                      className={dishStyles.error} />
                  </div>
                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Price
                    </label>
                    <Field
                      name="price"
                      type="number"
                      className={dishStyles.field} />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className={dishStyles.error} />
                  </div>
                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Dish quantity
                    </label>
                    <Field
                      name="dishQuantity"
                      type="number"
                      className={dishStyles.field} />
                    <ErrorMessage
                      name="dishQuantity"
                      component="div"
                      className={dishStyles.error} />
                  </div>
                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Category
                    </label>
                    <Field
                      as="select"
                      name="categoryStatus"
                      type="number"
                      className={dishStyles.field} >
                      <option value="">select a category</option>
                      <option value="1">Non veg</option>
                      <option value="2">Veg</option>
                      <option value="3">Juice</option>
                    </Field>
                    <ErrorMessage
                      name="categoryStatus"
                      component="div"
                      className={dishStyles.error} />
                  </div>
                  <div className={dishStyles.feilds}>
                    <label className={dishStyles.feildsLabel}>
                      Dish image
                    </label>
                    <Field
                      type="file"
                      name="dishImage"
                      className={dishStyles.field}
                      onChange={(e) => { fileUpload(e) }}
                    />
                  </div>
                  <div
                    className={dishStyles.subBtn}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="outlined" sx={{ width: '60%' }}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Modal>
    </div >

  )
}

export default MasterDishes