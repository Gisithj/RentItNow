using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Enums;
using RentItNow.Interfaces;
using RentItNow.Models;

namespace RentItNow.Repositories
{
    public class RentalItemRepository: GenericRepository<RentalItem>, IRentalItemRepository
    {
        public RentalItemRepository(RentItNowDbContext context, ILogger<GenericRepository<RentalItem>> logger) : base(context, logger)
        {

        }
        public async Task<RentalItem> GetRentalItemById(Guid rentalId)
        {
            try
            {
                var rentalItem = await dbSet
                    .Where(ri=>ri.RentalId==rentalId)
                    .Include(ri=>ri.Item)
                    .Include(ri=>ri.Item.ImageURLs)
                    .Include(ri => ri.Item.RentalOptions)
                    .Include(ri=>ri.Item.Specifications)
                    .FirstAsync();
                if (rentalItem != null)
                {
                    return rentalItem;

                }
                else
                {
                    throw new ArgumentNullException("Rental Item is null");
                }

            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw new(e.Message);
            }
        }
        public void UpdateRentalItem(IEnumerable<RentalItem> rentalItems)
        {
            try
            {
                if(rentalItems == null)
                {
                    throw new Exception("Rental Item not found");
                }
                dbSet.UpdateRange(rentalItems);

            }
            catch (Exception e)
            {

                throw new(e.Message);
            }
        }
        public Task DeleteRentalItemsBytItemId(Guid itemId)
        {
            try
            {
                List<RentalItem> rentalItems = dbSet.Where(r => r.ItemID == itemId).ToList();
                dbSet.RemoveRange(rentalItems);
                return Task.CompletedTask;
              
                
            }
            catch (Exception e)
            {

                throw new(e.Message);
            }
            
        }

        public List<RentalItem> GetAllRentalItemByCustomerIdAsync(Guid customerId)
        {
            try
            {
                List<RentalItem> rentalItems = dbSet.Where(r => r.CustomerId == customerId).ToList();
                return rentalItems;
            }
            catch (Exception e)
            {

                throw new(e.Message);

            }
            
        }
        public async Task<bool> IsRentalAvailable(Guid itemId, DateTimeOffset startDate, DateTimeOffset endDate) {            
            try
            {
                var IsRentalAvailable = await dbSet.Where(r => r.ItemID == itemId && (r.RentalStatus.Equals(RentalStatus.Rented)|| r.RentalStatus.Equals(RentalStatus.Reserved))).AsNoTracking()
                    .AnyAsync(r => (r.RentalStartDate <= startDate && r.RentalEndDate >= startDate) ||
                                                      (r.RentalStartDate <= endDate && r.RentalEndDate >= endDate) ||
                                                                                        (r.RentalStartDate >= startDate && r.RentalEndDate <= endDate));

                if(IsRentalAvailable)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception e)
            {

                throw new(e.Message);
            }
        }

        public async Task<IEnumerable<RentalItem>> GetAllRentedItemsByRenterWithIncludeAsync(Guid renterId)
        {
            try
            {
                var items = await dbSet
                                .Where(i => i.RenterId == renterId && i.isRentOver == false)
                                .Include(i => i.Item)
                                    .ThenInclude(i=>i.ImageURLs)
                                .Include(i => i.Item)
                                    .ThenInclude(i => i.RentalOptions)
                                .Include(i => i.Customer)
                                .ToListAsync();
                                //.Include(i => i.ImageURLs)
                                //.Include(i => i.RentalOptions)
                                //.Include(i => i.RentalItem)
                                //    .ThenInclude(ri => ri.Customer)
                                //.ToListAsync();
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



        public async Task<IEnumerable<RentalItem>> GetAllRentalItemsByCustomerId(Guid guid)
        {
            try
            {
                var rentalItems = await dbSet.Where(i => i.CustomerId == guid)
                                .OrderByDescending(i => i.RentalEndDate)
                                .Include(i => i.Item)
                                    .ThenInclude(i => i.ImageURLs)
                                .Include(i => i.Item)
                                    .ThenInclude(i => i.RentalOptions)
                                .Include(i => i.Customer)
                                .ToListAsync(); 
                //var items = await dbSet
                //                .Where(i => i.RentalItem.Any(ri => ri.CustomerId == guid))
                //                .OrderByDescending(i => i.RentalItem
                //                    .Where(ri => ri.CustomerId == guid)
                //                    .Max(ri => ri.RentalEndDate))
                //                .Include(i => i.RentalItem)
                //                .Include(i => i.RentalOptions)
                //                .ToListAsync();
                if (rentalItems == null || rentalItems.Count() == 0)
                {
                    throw new Exception("Items not found");
                }
                return rentalItems;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }




    }
}
