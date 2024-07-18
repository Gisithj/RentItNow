using Microsoft.AspNetCore.Mvc;
using RentItNow.configurations;
using RentItNow.Models;

namespace RentItNow.Services
{
    public interface IRentalItemService    {

        public Task<IEnumerable<RentalItem>?> GetAllRentalItems();
        public Task<IEnumerable<RentalItem>> GetAllRentedItemsByRenterWithIncludeAsync(Guid renterId);
        public Task<bool> RentItemAsync(RentalItem rentalItem);
        public Task EndRentItemAsync(Guid itemId, Guid rentalItemId);

        public void DeleteRentalItemsBytItemId(Guid itemId);
        public Task<bool> IsAvailableForRent(Guid itemId, DateTimeOffset startDate, DateTimeOffset endDate);
        public Task UpdateRentalItem(IEnumerable<RentalItem> rentalItems);
    }
}
