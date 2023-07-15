using AutoMapper;
using RentItNow.DTOs.Rent;
using RentItNow.DTOs.Renter;
using RentItNow.Models;

namespace RentItNow.Mapping
{
    public class ModelToDtoProfile : Profile
    {
        public ModelToDtoProfile() {
            CreateMap<Renter, GetRenterDto>().ReverseMap();
            CreateMap<CreateRenterDto, Renter>().ReverseMap();
        }
    }
}
