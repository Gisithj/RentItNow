import api from "@/utils/api";
import { Item, RentItem, UpdateItem } from "@/utils/interfaces";

export const IS_ITEM_AVAIALABLE = async (itemID:string, rentalStartDate:string, rentalEndDate:string) => {
  try {
    const response = await api.get(`/Items/IsItemAvailable`,{params:{itemId:itemID,rentalStartDate:rentalStartDate,rentalEndDate:rentalEndDate}});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GET_ALL_ITEMS_WITH_INCLUDE = async () => {
  try {    
    const response = await api.get("/Items/WithInclude");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GET_ALL_ITEMS_WITH_INCLUDE_PAGED = async (pageNumber:number,pageSize:number) => {
  try {    
    const response = await api.get(`/Items/GetWithOffsetPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GET_ALL_AVAILABLE_ITEMS_IN_DATERANGE_WITH_INCLUDE_PAGED = async (pageNumber:number,pageSize:number,startDate:string,endDate:string) => {
  try {    
    const response = await api.get(`/Items/GetAllAvailableItemsByDateRange?pageNumber=${pageNumber}&pageSize=${pageSize}&rentalStartDate=${startDate}&rentalEndDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GET_ITEM_BY_ID_WITH_INCLUDE = async (productId: string) => {
  try {
    const response = await api.get(`/Items/WithInclude/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GET_ITEMS_BY_RENTER_WITH_INCLUDE = async (renterId: string) => {
  try {
    const response = await api.get(`/Items/ItemsByRenter/${renterId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GET_RENTED_ITEMS_BY_RENTER_WITH_INCLUDE = async (renterId: string) => {
  try {
    const response = await api.get(`/Items/RentedItemsByRenter/${renterId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GET_ALL_RENTAL_ITEMS_BY_CUSTOMER_ID = async (customerId: string) => {
  try {
    const response = await api.get(`/Items/GetAllRentalItemByCustomerId/${customerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }

}
export const GET_RENTAL_ITEMS_BY_RENTAL_ID = async (rentalId: string) => {
  try {
    const response = await api.get(`/Items/GetRentalItemById/${rentalId}`);
    return response.data;
  } catch (error) {
    throw error;
  }

}
export const CREATE_ITEM = async (item: Item) => {
  try {
    const newItem = {
      itemName: item.itemName,
      category:item.category,
      itemDescription: item.itemDescription,
      rentalOptions: item.rentalOptions,
      specifications: item.specifications,
      images: item.imageURLs,
      isRented: item.isRented,
      itemOverview: item.itemOverview,
      renterId: item.renterId,
    };
    const response = await api.post("/Items", newItem); 
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const UPDATE_ITEM = async (item: UpdateItem) => {
  try {
    const newItem = {
      itemId: item.itemId,
      itemName: item.itemName,
      category:item.category,
      itemDescription: item.itemDescription,
      rentalOptions: item.rentalOptions,
      specifications: item.specifications,
      images: item.imageURLs,
      isRented: item.isRented,
      itemOverview: item.itemOverview,
    };
    const response = await api.put("/Items", newItem); 
    return response;
  } catch (error) {
    throw error;
  }
};

export const DELETE_ITEM = async (itemId: string) => {
  try {
    const response = await api.delete(`/Items/${itemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const RENT_ITEM = async (rentItem: RentItem) => {
  try {
    const response = await api.post('/Items/RentItem',rentItem);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const END_RENT_ITEM = async (itemId: string,rentItemId:string) => {
  try {
    const response = await api.post('/Items/EndRentItem',{ itemId: itemId, rentalItemId: rentItemId });
    return response.data;
  } catch (error) {
    throw error;
  }
};
