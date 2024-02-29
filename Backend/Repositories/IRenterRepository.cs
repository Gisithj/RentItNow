using RentItNow.DTOs.Rent;
using RentItNow.Models;

namespace RentItNow.Repository
{
    public interface IRenterRepository : IGenericRepository<Renter>
    {
        public Task<Renter> GetRenterByUsernameAsync(string renterName);
    }
}
