import api from "@/utils/api"



export const GET_ALL_RENTERS = async ()=>   {
    try {  
    const response = await api.get(`/Renters/GetAllRenters`); 
    return response.data
    } catch (error) {
    console.log(error);
    
    }
};
export const GET_RENTER_BY_ID = async (id:string)=>   {
    try {  
    const response = await api.get(`/Renters/GetRenterById/${id}`); 
    return response.data
    } catch (error) {
    console.log(error);
    
    }
};
