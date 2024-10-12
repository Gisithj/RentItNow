export interface User {
  id:string,
  userName:string,
  email:string,
  roleId:string,
  userRoles:string[]
  pictureUrl:string
    
}
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

// export interface RentalItem{
//     rentalStartDate:string,
//     rentalEndDate:string,
//     rentalOptionId:string
//     rentalPrice :number
//     Hours :number
//     isOverdue :boolean
//     overdueDays :number
//     rentalStatus:string
//     isRentOver:boolean
// }
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
    rentalPrice :number    
    rentalOptionId:string
    hoursCount?:number
    customerId:string
    renterId:string
}

export interface RentalItem {
    rentalId: string;
    rentalStartDate: string;
    rentalEndDate: string;
    rentalPrice :number
    hours :number
    isOverdue :boolean
    overdueDays :number
    rentalStatus:string
    isRentOver:boolean
    rentalOptionId: string;
    customerId: string;
    customer: Customer;
    itemID: string;
    item: Item;
    renterId: string;
  
}

export interface CustomerRentalItem {
    rentalId: string;
    item: Item;
    rentalStartDate: string;
    rentalEndDate: string;
    rentalPrice :number
    hours :number
    isOverdue :boolean
    overdueDays :number
    rentalStatus:string
    isRentOver:boolean
    renterId: string;  
    rentalOptionId: string;

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
    userId:string
    renterId: string
    renterName: string
    renterAddress: string
    contactNo: string
}
export interface CreateUser{
  name?: string;
    renterName?: string
    email: string;
    renterAddress?: string
    address?: string;
    contactNo: string
    userName: string
    password: string
    pictureUrl:string,
}
export interface Customer {
    
    userId?: string;
    customerId: string;
    name: string;
    email: string;
    contactNo: string;
    address: string;
  }
  export enum MessageStatus {
    SENT = 0,
    DELIVERED = 1,
    READ = 2
  }
  export interface Message {
    id:string
    content: string; 
    timestamp :string
    senderId :string
    receiverId :string
    status:MessageStatus
    chatId:string
  }
  export interface CreateChat {
    senderId :string
    receiverId :string
  }
  export interface Chat {
    id:string
    timestamp :string
    senderId :string
    receiverId :string
    sender:User
    receiver:User
    unreadCount:number
  }

  export interface Notification {
    id: string,
    userId: string,
    senderId: string,
    title: string,
    message: string,
    isNotificationRead: boolean,
    createdAt:Date
  }
