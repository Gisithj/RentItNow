using RentItNow.Data;
using RentItNow.Models;
using RentItNow.Repositories;
using RentItNow.Repository;

namespace RentItNow.Services
{
    public class ItemRepository : GenericRepository<Item>, IItemRepository
    {
        public ItemRepository(RentItNowDbContext context) : base(context)
        {
        }

        public Task<Item> GetItemByNameAsync(string itemName)
        {
            throw new NotImplementedException();
        }
    }
}
