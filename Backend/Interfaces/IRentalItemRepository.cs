using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface IRentalItemRepository : IGenericRepository<RentalItem>
    {
        public List<RentalItem> GetAllRentalItemByCustomerIdAsync(Guid customerId);
    }
}
