using RentItNow.Models;
using RentItNow.Repository;
using RentItNow.Services;

namespace RentItNow.Repositories
{
    public interface IItemRepository:IGenericRepository<Item>
    {
        public Task<Item> GetItemByNameAsync(string itemName);
    }
}
