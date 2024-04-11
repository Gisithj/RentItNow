using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;

namespace RentItNow.Repositories
{
    public class RentalItemRepository: GenericRepository<RentalItem>, IRentalItemRepository
    {
        public RentalItemRepository(RentItNowDbContext context) : base(context)
        {

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


    }
}
