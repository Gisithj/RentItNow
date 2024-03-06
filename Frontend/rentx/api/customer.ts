import api from "@/utils/api";

interface Customer{
        name: string
        email: string
        contactNo: string
        address: string
        userName: string
        password: string
}


export const GET_ALL_CUSTOMER =async ()=>   {
    try {  
      const response = await api.get('/Customers'); // Your API endpoint
      return response
    } catch (error) {
      console.log(error);
      
    }
  };