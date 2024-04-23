import api from "@/utils/api";
import { Item, UpdateItem } from "@/utils/interfaces";

export const GET_ALL_ITEMS_WITH_INCLUDE = async () => {
  try {    
    const response = await api.get("/Items/WithInclude");
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};
export const GET_ITEM_BY_ID_WITH_INCLUDE = async (productId: string) => {
  try {
    const response = await api.get(`/Items/WithInclude/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item with id ${productId}:`, error);
  }
};
export const GET_ITEMS_BY_RENTER_WITH_INCLUDE = async (renterId: string) => {
  try {
    const response = await api.get(`/Items/ItemsByRenter/${renterId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item with id ${renterId}:`, error);
  }
};

export const CREATE_ITEM = async (item: Item) => {
  try {
    console.log("in herer");

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
    console.log(newItem);

    const response = await api.post("/Items", newItem); // Your API endpoint
    return response;

    //   res.status(200).json(response.data);
  } catch (error) {
    console.log(error);

    //   res.status(500).json({ error: 'Error creating user' });
  }
};
export const UPDATE_ITEM = async (item: UpdateItem) => {
  try {
    console.log("in herer");

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
    console.log(newItem);

    const response = await api.put("/Items", newItem); // Your API endpoint
    return response;

    //   res.status(200).json(response.data);
  } catch (error) {
    console.log(error);

    //   res.status(500).json({ error: 'Error creating user' });
  }
};

export const DELETE_ITEM = async (itemId: string) => {
  try {
    const response = await api.delete(`/Items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item with id ${itemId}:`, error);
  }
};
