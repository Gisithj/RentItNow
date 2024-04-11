import api from "@/utils/api";

interface Item {
  itemName: string;
  itemDescription: string;
  rentalOptions: { rentalOptionName: string; price: number }[];
  specifications: { specificationFeature: string; featureDetail: string }[];
  images: string[];
  itemOverview: string;
  isRented: boolean;
  renterId: string;
}
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

export const CREATE_ITEM = async (item: Item) => {
  try {
    console.log("in herer");

    const newItem = {
      itemName: item.itemName,
      itemDescription: item.itemDescription,
      rentalOptions: item.rentalOptions,
      specifications: item.specifications,
      images: item.images,
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
