using RentItNow.Models;
using RentItNow.Services;

namespace RentItNow.Interfaces
{
    public interface IItemRepository : IGenericRepository<Item>
    {
        
        public Task<Item> GetItemWithIncludeByIdAsync(Guid id);
        public Task<IEnumerable<Item>> GetAllItemsWithIncludeAsync();
        public Task<IEnumerable<Item>> GetAllItemsByRenterWithIncludeAsync(Guid renterId);
        public Task<IEnumerable<Item>> GetAllAvailableItemsByDateRangeWithInclude(DateTimeOffset rentalStartDate, DateTimeOffset rentalEndDateint ,int pageNumber,int pageSize);
        
    }
}
