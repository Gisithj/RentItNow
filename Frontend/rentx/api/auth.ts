import api from "@/utils/api";
import { CreateUser, Renter } from "@/utils/interfaces";
import axios from "axios";

interface Login{
    username: string
    password: string
}
interface Customer{
    name: string
    email: string
    contactNo: string
    address: string
    userName: string
    password: string
}
export const LOGIN = async (customer:Login)=> {
    try {
        console.log("in herer");
        
      const newCustomer ={
        "username":  customer.username,
        "password":  customer.password
      }
      console.log(newCustomer);
      
      const response = await api.post('/Auth/login', newCustomer); // Your API endpoint
      return response;
      
    //   res.status(200).json(response.data);
    } catch (error) {
      
      if (axios.isAxiosError(error)) {        
        return error.response;
      }
        console.log(error);
        
    //   res.status(500).json({ error: 'Error creating user' });
    }
  };
export const LOGOUT = async ()=> {
    try {
        console.log("in herer");
      
      const response = await api.post('/Auth/logout'); // Your API endpoint
      return response;
      
    //   res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        
    //   res.status(500).json({ error: 'Error creating user' });
    }
  };

  export const REGISTER_CUSTOMER = async (customer:CreateUser)=> {
    try {
        console.log("in herer");
        
      const newCustomer ={
        "name": customer.name,
        "email": customer.email,
        "contactNo":  customer.contactNo,
        "address":  customer.address,
        "userName":  customer.userName,
        "password":  customer.password,
        "pictureUrl": customer.pictureUrl,
      }
      console.log(newCustomer);
      
      const response = await api.post('/Auth/register-customer', newCustomer); // Your API endpoint
      return response;
      
    //   res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        
    //   res.status(500).json({ error: 'Error creating user' });
    }
  };
  export const REGISTER_RENTER = async (renter:CreateUser)=> {
    try {
        console.log("in herer");
        
      const newRenter ={
        "renterName": renter.name,
        "renterAddress":  renter.address,
        "ContactNo":  renter.contactNo,
        "Email": renter.email,
        "UserName":  renter.userName,
        "Password":  renter.password,
        "PictureUrl": renter.pictureUrl,
      }
      console.log(newRenter);
      
      const response = await api.post('/Auth/register-renter', newRenter); // Your API endpoint
      return response;
      
    //   res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        
    //   res.status(500).json({ error: 'Error creating user' });
    }
  };
  export const CHECK_AUTH = async ()=> {
    try {
      const response = await api.get('/Auth/auth-check'); // Your API endpoint
      if(response.status === 200 || response.status === 201 || response.status === 401){
        return response;
      }else{
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        // Handle 401 Unauthorized without logging it as an error
        console.log('Unauthorized access - 401');
        return null;
      } else {
        // Log other errors
        console.error('An error occurred:', error);
        throw error;
      }
    }
  };

  export const GET_USER = async ()=>{
    try {   
      const response = await api.get('/Auth/getUser');
        return response;
      //return response;
    } catch (error) {
        console.log(error);
    }
  }

  export const GOOGLE_LOGIN = async (usertype:string)=>{
    try {   
      const response = await api.get(`/Auth/signin-google/${usertype}`);
      return response;
      //return response;
    } catch (error) {
        console.log(error);
    }
  }

  