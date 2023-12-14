
import axios from 'axios';

const BASE_URL = "http://localhost:4000/";

export const getMasterDishes = () => {
    return axios.get(BASE_URL + "user/getMasterDish");
};

export const postOffers = (body) => {
    const config = {
        headers: {
            // Add your desired headers here
            Authorization: ` eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb3lhbEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IkhtZEAxMjM0NSIsImlhdCI6MTY5MTEzOTIxOSwiZXhwIjoxNjkxMTQyODE5fQ.qEeUUPnQ0lxGXP24h3FlV7sKlQgPaeYusPULeGvzwN0`, // Example of an authorization header
            'Content-Type': 'application/json', // Example of a content type header
        },
    }
    return axios.post(BASE_URL + "user/add-offers", body, config);
}
export const getDishes = (page, searchTerm) => {
    const token = localStorage.getItem("AccessToken"); // Get the token here
    const config = {
        headers: {
            Authorization: token, // Add the token to the header
            'Content-Type': 'application/json',
        },
    };
    return axios.get(BASE_URL + `shop/getDishShopwise?page=${page}&search=${encodeURI(searchTerm)}`, config);
}
export const deleteDish = (id) => {
    const token = localStorage.getItem("AccessToken"); // Get the token here
    const config = {
        headers: {
            // Add your desired headers here
            Authorization: token, // Example of an authorization header
            'Content-Type': 'application/json', // Example of a content type header
        },
    }
    return axios.delete(BASE_URL + `shop/deleteDish/${id}`, config);
}
export const postDishes = (body) => {
    const token = localStorage.getItem("AccessToken"); // Get the token here
    const config = {
        headers: {
            // Add your desired headers here
            Authorization: token, // Example of an authorization header
            'Content-Type': "multipart/form-data"  // Example of a content type header
        },
    }
    return axios.post(BASE_URL + "shop/addDish", body, config);
}


export const postGIftcards = (body) => {
    const token = localStorage.getItem("AccessToken"); // Get the token here
    const config = {
        headers: {
            // Add your desired headers here
            Authorization: token, // Example of an authorization header
            'Content-Type': 'application/json'  // Example of a content type header
        },
    }
    return axios.post(BASE_URL + "offers/giftCards", body, config);
}

export const getGIftcards = () => {
    const token = localStorage.getItem("AccessToken"); // Get the token here
    const config = {
        headers: {
            // Add your desired headers here
            Authorization: token, // Example of an authorization header
            'Content-Type': 'application/json'  // Example of a content type header
        },
    }
    return axios.get(BASE_URL + "offers/giftCards", config);
}

export const deleteGIftcards = (id) => {
    const token = localStorage.getItem("AccessToken"); // Get the token here
    const config = {
        headers: {
            // Add your desired headers here
            Authorization: token, // Example of an authorization header
        },
    }
    return axios.delete(BASE_URL + `offers/deleteCard/${id}`, config);
}


