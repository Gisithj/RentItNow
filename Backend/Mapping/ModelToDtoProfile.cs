﻿using AutoMapper;
using Microsoft.AspNetCore.Identity;
using RentItNow.DTOs;
using RentItNow.DTOs.Chat;
using RentItNow.DTOs.Customer;
using RentItNow.DTOs.Item;
using RentItNow.DTOs.Message;
using RentItNow.DTOs.Rent;
using RentItNow.DTOs.Renter;
using RentItNow.DTOs.User;
using RentItNow.Models;

namespace RentItNow.Mapping
{
    public class ModelToDtoProfile : Profile
    {
        public ModelToDtoProfile() {

            CreateMap(typeof(PagedResponse<>), typeof(OffsetPagedResponse<>)).ReverseMap();

            CreateMap<IdentityUser, User>().ReverseMap();
            CreateMap<IdentityUser, GetUserDto>().ReverseMap();
            CreateMap<User, GetUserDto>().ReverseMap();

            CreateMap<CreateRenterDto, User>().ReverseMap();
            CreateMap<CreateRenterDto, Renter>().ReverseMap();
            CreateMap<CreateRenterDto, CreateUserDto>().ReverseMap();
            CreateMap<Renter, GetRenterDto>()
                //.ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User != null ? (Guid?)Guid.Parse(src.User.Id) : null))
                .ReverseMap();
            CreateMap<Renter, UpdateRenterDto>().ReverseMap();

            CreateMap<CreateCustomerDto, User>().ReverseMap();
            CreateMap<CreateCustomerDto, Customer>().ReverseMap();
            CreateMap<CreateCustomerDto, CreateUserDto>().ReverseMap();
            CreateMap<Customer, GetCustomerDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User != null ? (Guid?)Guid.Parse(src.User.Id) : null))
                .ReverseMap();
            CreateMap<Customer, UpdateCustomerDto>().ReverseMap();

            //CreateMap<CreateItemDto, Item>().ReverseMap()
            //    .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images.Select(i => new ItemImage { Base64Image = i.Base64Image }))); 
            CreateMap<Item, Item>();
            CreateMap<CreateItemDto, Item>()
               .ForMember(dest => dest.ImageURLs, opt => opt.MapFrom(src => src.Images.Select(i => new ItemImage { ImageURL = i.ToString() })))
               .ForMember(dest => dest.RentalOptions, opt => opt.MapFrom(src => src.RentalOptions.Select(ro => new RentalOption { RentalOptionName=ro.RentalOptionName,Price=ro.Price })))
               .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications.Select(spec => new ItemSpecification { SpecificationFeature = spec.SpecificationFeature, FeatureDetail = spec.FeatureDetail })))
               .ReverseMap();
            CreateMap<Item, GetItemDto>()
                .ForMember(dest =>dest.RentalStatus, opt => opt.MapFrom(src => src.RentalStatus.ToString()))
                .ReverseMap();
            CreateMap<Item, UpdateItemDto>().ReverseMap();
            CreateMap<ItemSpecDto,ItemSpecification>().ReverseMap();

            CreateMap<Item, ItemDto>()
            .ForMember(dest => dest.RentalStatus, opt => opt.MapFrom(src => src.RentalStatus.ToString()))
            .ForMember(dest => dest.ImageURLs, opt => opt.MapFrom(src => src.ImageURLs.Select(i => i.ImageURL)))
            .ForMember(dest => dest.RentalOptions, opt => opt.MapFrom(src => src.RentalOptions.Select(ro => new RentalOptionDto {Id = ro.Id, RentalOptionName=ro.RentalOptionName , Price=ro.Price })));

            CreateMap<RentalOptionDto, RentalOption>().ReverseMap();

            CreateMap<RentalRequestDto, RentalItem>().ReverseMap();
            CreateMap<RentaItemDto, RentalItem>()
                 .ForMember(dest => dest.RentalStatus, opt => opt.MapFrom(src => src.RentalStatus.ToString()))
                .ReverseMap();

            CreateMap<UpdateItemDto, Item>()
               .ForMember(dest => dest.ImageURLs, opt => opt.MapFrom(src => src.Images.Select(i => new ItemImage { ImageURL = i.ToString() })))
               .ForMember(dest => dest.RentalOptions, opt => opt.MapFrom(src => src.RentalOptions.Select(ro => new RentalOption { RentalOptionName = ro.RentalOptionName, Price = ro.Price })))
               .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications.Select(spec => new ItemSpecification { SpecificationFeature = spec.SpecificationFeature, FeatureDetail = spec.FeatureDetail })))
               .ReverseMap();

            CreateMap<MessageDto, Messages>().ReverseMap();

            CreateMap<Chat, ChatDto>()
                .ReverseMap();
            CreateMap<CreateChatDto, Chat>()
                .ReverseMap();
        }
    }
}
