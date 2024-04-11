using Microsoft.AspNetCore.Mvc;
using RentItNow.configurations;
using RentItNow.Models;

namespace RentItNow.Services
{
    public interface IRentalItemService    {


        public Task RentItemAsync(RentalItem rentalItem);

      
    }
}
