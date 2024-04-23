using AutoMapper;
using Microsoft.AspNetCore.Identity;
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

            CreateMap<IdentityUser, User>().ReverseMap();
            CreateMap<IdentityUser, GetUserDto>().ReverseMap();


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

            //CreateMap<CreateItemDto, Item>().ReverseMap()
            //    .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images.Select(i => new ItemImage { Base64Image = i.Base64Image }))); 
            CreateMap<Item, Item>();
            CreateMap<CreateItemDto, Item>()
               .ForMember(dest => dest.ImageURLs, opt => opt.MapFrom(src => src.Images.Select(i => new ItemImage { ImageURL = i.ToString() })))
               .ForMember(dest => dest.RentalOptions, opt => opt.MapFrom(src => src.RentalOptions.Select(ro => new RentalOption { RentalOptionName=ro.RentalOptionName,Price=ro.Price })))
               .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications.Select(spec => new ItemSpecification { SpecificationFeature = spec.SpecificationFeature, FeatureDetail = spec.FeatureDetail })))
               .ReverseMap();
            CreateMap<Item, GetItemDto>().ReverseMap();
            CreateMap<Item, UpdateItemDto>().ReverseMap();
            CreateMap<ItemSpecDto,ItemSpecification>().ReverseMap();

            CreateMap<Item, ItemDto>()
            .ForMember(dest => dest.ImageURLs, opt => opt.MapFrom(src => src.ImageURLs.Select(i => i.ImageURL)))
            .ForMember(dest => dest.RentalOptions, opt => opt.MapFrom(src => src.RentalOptions));

            CreateMap<RentalOptionDto, RentalOption>().ReverseMap();
            CreateMap<RentItemDto, RentalItem>().ReverseMap();

            CreateMap<UpdateItemDto, Item>()
               .ForMember(dest => dest.ImageURLs, opt => opt.MapFrom(src => src.Images.Select(i => new ItemImage { ImageURL = i.ToString() })))
               .ForMember(dest => dest.RentalOptions, opt => opt.MapFrom(src => src.RentalOptions.Select(ro => new RentalOption { RentalOptionName = ro.RentalOptionName, Price = ro.Price })))
               .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications.Select(spec => new ItemSpecification { SpecificationFeature = spec.SpecificationFeature, FeatureDetail = spec.FeatureDetail })))
               .ReverseMap();


        }
    }
}
