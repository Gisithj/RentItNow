import api from "@/utils/api"



export const GET_RENTER_BY_ID = async (id:string)=>   {
    try {  
    const response = await api.get(`/Renters/GetRenterById/${id}`); 
    return response.data
    } catch (error) {
    console.log(error);
    
    }
};
