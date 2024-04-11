using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {
        public Task<Customer> GetCustomerByUsernameAsync(string customerName);
        public Task<Customer> GetCustomerByUserIdAsync(string userId);
        public Task<Customer> GetCustomerWithRentedItems(Guid customerId);
    }
}
