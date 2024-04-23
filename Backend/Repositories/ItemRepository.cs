using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;

namespace RentItNow.Repositories
{
    public class ItemRepository : GenericRepository<Item>, IItemRepository
    {
        
        public ItemRepository(RentItNowDbContext context) : base(context)
        {

        }

        public async Task<Item> GetItemWithIncludeByIdAsync(Guid id)
        {
            try
            {
                var item = await dbSet
                                .Where(i => i.ItemId == id)
                                .Include(i => i.ImageURLs)
                                .Include(i => i.RentalOptions)
                                .Include(i => i.Specifications)

                                .FirstOrDefaultAsync();
                if (item == null)
                {
                    throw new Exception("Item not found");
                }
                return item;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }

        public async Task<IEnumerable<Item>> GetAllItemsWithIncludeAsync()
        {
            try
            {
                var items = await dbSet
                                .Include(i => i.ImageURLs.Take(1))
                                .Include(i => i.RentalOptions)
                                .ToListAsync();
                if (items == null || items.Count() == 0)
                {
                    throw new Exception("Items not found");
                }
                return items;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }

        public async Task<IEnumerable<Item>> GetAllItemsByRenterWithIncludeAsync(Guid renterId)
        {
            try
            {
                var items = await dbSet
                                .Where(i=>i.RenterId == renterId)
                                .Include(i => i.ImageURLs)
                                .Include(i => i.RentalOptions)
                                .ToListAsync();
                if (items == null || items.Count() == 0)
                {
                    throw new Exception("Items not found");
                }
                return items;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }
        

    }
}
