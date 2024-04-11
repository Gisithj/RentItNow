using RentItNow.DTOs.Rent;
using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface IRenterRepository : IGenericRepository<Renter>
    {
        public Task<Renter> GetRenterByUsernameAsync(string renterName);
        public Task<Renter> GetRenterByUserIdAsync(string userId);
    }
}
