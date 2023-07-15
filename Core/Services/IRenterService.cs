using RentItNow.Models;

namespace RentItNow.Core.Services
{
    public interface IRenterService
    {
        public Task<List<Renter>> GetRenters();
        public Task<Renter> GetRenterByUsername(string username);
        public Task<Renter> GetRenterById(int id);
        public Task<Renter?> UpdateRenter(int id, Renter renter);
        public Task<Renter> CreateRenter(Renter renter);
        public Task<bool> DeleteRenter(int id);
    }
}
