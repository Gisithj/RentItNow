using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.DTOs.Rent;
using RentItNow.DTOs.Renter;
using RentItNow.Models;
using System.Configuration;

namespace RentItNow.Services
{
    public interface IRenterService
    {
        public Task<string> CreateRenterAsync(User user, CreateRenterDto createRenterDto);
        public Task<IEnumerable<Renter>> GetAllRentersAsync();


    }
}
