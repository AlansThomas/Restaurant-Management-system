const exp = require('express')
const app = exp()
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes')
const shopRoutes = require('./routes/shop.routes')
const notificationRoutes = require('./routes/notifications.routes')
const offersRoutes = require('./routes/offers.routes')
const express = require('express');
const path = require('path');
const cors = require('cors'); // Import the cors package
// const dbconfig=require('./DbConfiguration/DBsetUp')
// const { Sequelize } = require('sequelize');
// const User=require('./Models/User.model')

// app.use(cors());
app.use(cors({ credentials: true, origin: '*' }));

const allowedOrigins = ['http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/ShopImages', express.static(path.join(__dirname, 'ShopImages')));

app.use('/user', userRoutes)
app.use('/notifications', notificationRoutes)

app.use('/shop', shopRoutes)

app.use('/offers', offersRoutes)





app.listen(4000, () => {
  console.log("port is running")
})