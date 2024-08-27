using Microsoft.AspNetCore.Mvc;
using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface IRentalItemRepository : IGenericRepository<RentalItem>
    {
        public Task<RentalItem> GetRentalItemById(Guid rentalId);
        public Task DeleteRentalItemsBytItemId(Guid itemId);
        public List<RentalItem> GetAllRentalItemByCustomerIdAsync(Guid customerId);
        public Task<IEnumerable<RentalItem>> GetAllRentedItemsByRenterWithIncludeAsync(Guid renterId);
        public Task<bool> IsRentalAvailable(Guid itemId, DateTimeOffset startDate, DateTimeOffset endDate);
        public void UpdateRentalItem(IEnumerable<RentalItem> rentalItems);
        public Task<IEnumerable<RentalItem>> GetAllRentalItemsByCustomerId(Guid guid);
    }
}
