/* eslint-disable react-refresh/only-export-components */

const BASE_URL = import.meta.env.VITE_API_URL;

import axios from 'axios';
import { axiosPrivate } from '../interceptors/interceptors';



// user login
export const Userlogin = (body) => {
    return axios.post(BASE_URL + "user/login", body)
}

// user reegistrations
export const userRegister = (userform) => {
    return axios.post(BASE_URL + "user/register", userform);
};

//get current user details
export const currentUser = () => {
    return axiosPrivate.get(BASE_URL + "user/currentUser",);
};

// get notifications
export const getNotifications = () => {
    return axiosPrivate.get(BASE_URL + "notifications/getNoti");
};

// mark all notifiactions as read
export const MarkAllasRead = () => {
    return axiosPrivate.put(BASE_URL + "notifications/mark-all-read");
};

// mark one  notifiactions as read
export const markOneasRead = (id) => {
    return axiosPrivate.put(BASE_URL + "notifications/mark-one-read/" + id)
}

// get shops and details
export const getShops = (params) => {
    return axios.get(BASE_URL + `user/getShop`, { params: params })
}

// get one shop details 
export const getShopdDetails = (id) => {
    return axios.get(BASE_URL + "shop/shpDetails/" + id)
}

//get master dishes
export const getMasterDishes = (params) => {
    return axios.get(BASE_URL + "user/getMasterDish", { params: params })
}

//search Dishes  and get dishes
export const dishSearch = (body) => {
    return axios.post(BASE_URL + "shop/getDishFilterShopwise", body)
}

// ordered dish details
export const orderedDishes = (id, body) => {
    return axios.post(BASE_URL + "shop/orderDishDetails/" + id, body)
}

// get gift cards posted  by admin
export const getGiftCards = () => {
    return axios.get(BASE_URL + "offers/giftCards")
}

//get time slots of the shops
export const getTimeSlots = (body) => {
    return axios.post(BASE_URL + "shop/getTimeslot", body)
}

// get tables with shops
export const getShopTables = (id, body) => {
    return axios.post(BASE_URL + "shop/getShopTables/" + id, body)
}

// book table and place order
export const order = (body) => {
    return axiosPrivate.post(BASE_URL + "shop/bookTable", body)
}

//  get order history
export const getOrderHistory = ( body) => {
    return axiosPrivate.post(BASE_URL + "user/getMyOrders" , body)
}


// order check-in
export const orderCheckIn = (id) => {
    return axiosPrivate.put(BASE_URL + "user/orderCheckIn/" + id)
}

// order check-out
export const orderCheckOut = (id) => {
    return axiosPrivate.put(BASE_URL + "user/orderCheckOut/" + id)
}