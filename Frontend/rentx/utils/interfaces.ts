export interface Item{
    itemName: string
    category:string
    itemDescription: string
    rentalOptions:{rentalOptionName:string,price:number}[]
    specifications: {specificationFeature:string,featureDetail:string}[]
    imageURLs: string[]
    itemOverview:string
    isRented: boolean
    renterId:string
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
