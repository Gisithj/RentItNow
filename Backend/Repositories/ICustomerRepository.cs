using RentItNow.Models;
using RentItNow.Repository;

namespace RentItNow.Repositories
{
    public interface ICustomerRepository:IGenericRepository<Customer>
    {
        public Task<Customer> GetCustomerByUsernameAsync(string customerName);
    }
}
