using AutoMapper;
using RentItNow.DTOs.Customer;
using RentItNow.DTOs.Item;
using RentItNow.DTOs.Rent;
using RentItNow.DTOs.Renter;
using RentItNow.DTOs.User;
using RentItNow.Models;

namespace RentItNow.Mapping
{
    public class ModelToDtoProfile : Profile
    {
        public ModelToDtoProfile() {
            
            CreateMap<CreateRenterDto, User>().ReverseMap();
            CreateMap<CreateRenterDto, Renter>().ReverseMap();
            CreateMap<CreateRenterDto, CreateUserDto>().ReverseMap();
            CreateMap<Renter, GetRenterDto>().ReverseMap();
            CreateMap<Renter, UpdateRenterDto>().ReverseMap();

            CreateMap<CreateCustomerDto, User>().ReverseMap();
            CreateMap<CreateCustomerDto, Customer>().ReverseMap();
            CreateMap<CreateCustomerDto, CreateUserDto>().ReverseMap();
            CreateMap<Customer, GetCustomerDto>().ReverseMap();
            CreateMap<Customer, UpdateCustomerDto>().ReverseMap();

            CreateMap<CreateItemDto, Item>().ReverseMap();
            CreateMap<Item, GetItemDto>().ReverseMap();
            CreateMap<Item, UpdateItemDto>().ReverseMap();


        }
    }
}
