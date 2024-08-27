interface RentalOption {
    id?: string;
    rentalOptionName: string;
    price: number;
  }
export interface PagedItem {
    itemId: string;
    itemName: string;
    category: string;
    itemDescription: string;
    itemOverview: string;
    isRented: boolean;
    rentalStatus:string;
    renterId: string;
    imageURLs: string[];
    rentalOptions: RentalOption[];
    specifications: { specificationFeature: string; featureDetail: string }[];
}
export interface GetItem{
    itemId:string
    itemName: string
    category:string
    itemDescription: string
    rentalOptions:RentalOption[]
    specifications: {specificationFeature:string,featureDetail:string}[]
    imageURLs: string[]
    itemOverview:string
    isRented: boolean
    rentalStatus:string
    renterId:string
}
export interface Item{
    itemName: string
    category:string
    itemDescription: string
    rentalOptions:RentalOption[]
    specifications: {specificationFeature:string,featureDetail:string}[]
    imageURLs: string[]
    rentalItem?:{rentalStartDate:string,rentalEndDate:string,rentalOptionId:string}[]
    itemOverview:string
    isRented: boolean
    renterId:string
}
export interface RentItem{

    itemId:string
    rentalStartDate:string
    rentalEndDate:string
    
    rentalOptionId:string
    hoursCount?:number
    customerId:string
    renterId:string
}

export interface RentalItem {
    rentalId: string;
    rentalStartDate: string;
    rentalEndDate: string;
    hours: number;
    isRentOver: boolean;
    rentalOptionId: string;
    customerId: string;
    customer: Customer;
    itemID: string;
    item: Item;
    renterId: string;
  
  }

export interface UpdateItem{
    itemId:string
    itemName: string
    category:string
    itemDescription: string
    rentalOptions:{rentalOptionName:string,price:number}[]
    specifications: {specificationFeature:string,featureDetail:string}[]
    imageURLs: string[]
    itemOverview:string
    isRented: boolean
}

export interface Renter{
    renterId: string
    renterName: string
    renterAddress: string
    contactNo: string
}
export interface Customer {
    customerId: string;
    name: string;
    email: string;
    contactNo: string;
    address: string;
    userId: string;
  }
