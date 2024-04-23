import api from "@/utils/api";
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

  export const REGISTER_CUSTOMER = async (customer:Customer)=> {
    try {
        console.log("in herer");
        
      const newCustomer ={
        "name": customer.name,
        "email": customer.email,
        "contactNo":  customer.contactNo,
        "address":  customer.address,
        "userName":  customer.userName,
        "password":  customer.password
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
  export const CHECK_AUTH = async ()=> {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      };      
      const response = await api.get('/Auth/auth-check',config); // Your API endpoint
      return response;
    } catch (error) {
        console.log(error);
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

  