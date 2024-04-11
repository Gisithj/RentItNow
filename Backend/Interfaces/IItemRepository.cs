using RentItNow.Models;
using RentItNow.Services;

namespace RentItNow.Interfaces
{
    public interface IItemRepository : IGenericRepository<Item>
    {
        
        public Task<Item> GetItemWithIncludeByIdAsync(Guid id);
        public Task<IEnumerable<Item>> GetAllItemsWithIncludeAsync();
    }
}
