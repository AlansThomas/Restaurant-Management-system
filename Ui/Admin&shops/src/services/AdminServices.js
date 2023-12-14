import axios from "axios";
import { axiosInstance } from "./interceptor";
import config from './serverConfig';
let token = localStorage.getItem('AccessToken')
export async function userLogin(data) {
  return await axios.post(`${config.API_URL}/user/login`, data);
}
export async function shopLogin(data) {
  return await axios.post(`${config.API_URL}/shop/shopLogin`, data);
}

export async function addTable(data) {
  return await axiosInstance.post(`/user/addTableType`,data );
}
export async function deleteTable(id){
  return await axiosInstance.delete(`/user/deleteTableType/${id}` );

}
export async function topDishes(){
  return await axiosInstance.get(`/user/top5Dishes` );

}

export async function getTable() {
  return await axiosInstance.get(`/user/getTableType` );
}
export async function getOrderHistory(currentPage) {
  return await axiosInstance.get(`/user/dishBookingHistory?page=${currentPage}` );
}


export async function AddShop(data, mediaType) {
  try {
    const headers = {
      "Content-type": mediaType === "multipart" ? "multipart/form-data" : "application/json",
      Authorization: ` ${localStorage.getItem("AccessToken")}`,
    };

    const response = await axiosInstance.post(`/user/addShop`, data, { headers });
    return response.data;
  } catch (error) {
    // Handle errors
    console.log('Error adding shop:', error);
    throw error;

  }
}

export async function EditShopDetails(id, data, mediaType) {
  try {
    const headers = {
      "Content-type": mediaType === "multipart" ? "multipart/form-data" : "application/json",
      Authorization: ` ${localStorage.getItem("AccessToken")}`,
    };

    const response = await axiosInstance.put(`/user/editShop/${id}`, data, { headers });
    return response.data;
  } catch (error) {
    console.log(error);
    // Handle errors
    throw error;
  }
}

export async function deleteShop(id) {
  try{
const response = await axiosInstance.delete(`/user/deleteShop/${id}` );
return response
  
  }catch(error){
    console.log(error);
    throw error
  }
}
export async function deleteMasterDishes(id) {
  try{
const response = await axiosInstance.delete(`/user/deleteMasterDish/${id}` );
return response
  
  }catch(error){
    console.log(error);
    throw error
  }
}


export async function AddMasterdish(data, mediaType) {
  try {
    const headers = {
      "Content-type": mediaType === "multipart" ? "multipart/form-data" : "application/json",
      Authorization: ` ${localStorage.getItem("AccessToken")}`,
    };

    const response = await axiosInstance.post(`/user/addMasterDish`, data, { headers });
    return response.data;

  } catch (error) {
    // Handle errors
    return error
  }
}

export async function editMasterDishes(id,data, mediaType) {
  try {
    const headers = {
      "Content-type": mediaType === "multipart" ? "multipart/form-data" : "application/json",
      Authorization: ` ${localStorage.getItem("AccessToken")}`,
    };

    const response = await axiosInstance.put(`/user/editMasterdish/${id}`, data, { headers });
    return response.data;

  } catch (error) {
    // Handle errors
    return error
  }
}


export async function getShops(page) {
  return await axiosInstance.get(`/user/getShop?page=${page}`);
}
export async function getCounts() {
  return await axiosInstance.get(`/user/dataCount`);
}
export async function activate(id) {
  return await axiosInstance.put(`/user/activate/${id}`);
}
export async function deactivate(id) {
  return await axiosInstance.put(`/user/deactivate/${id}`);
}

export async function getMasterdish(page) {
  return await axiosInstance.get(`/user/getMasterDish?page=${page}`);
}
export async function getUsers(page, searchKey) {
  const response = await axiosInstance.get(`/user/getUsersRankWise?page=${page}&searchkey=${encodeURI(searchKey)}`);
  return response.data; // Assuming the data is returned in the response's data property
}
export const refreshToken = () => {
    let refreshToken = localStorage.getItem("refreshToken");
    return axiosInstance.put(`/user/update`, {
      refreshToken: refreshToken,
    });
  };
  
 





//Shop Add timeslot



export async function addTimeslot(data) {
  const config = {
    headers: {
      // Add your desired headers here
      Authorization: token, // Example of an authorization header
      'Content-Type': 'application/json', // Example of a content type header
    },
  };
  
  return await axios.post(`http://localhost:4000/shop/addTimeslot`, data, config);
}

