import api from "@/utils/api";


export const GET_ALL_CUSTOMERS =async ()=>   {
    try {  
      const response = await api.get('/Customers/GetAllCustomers');
      return response.data;
    } catch (error) {
      console.log(error);
      
    }
  };
