using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;
using System.Linq.Expressions;

namespace RentItNow.Repositories
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(RentItNowDbContext context, ILogger<GenericRepository<Customer>> logger) : base(context,logger)
        {
        }

        public async Task<IEnumerable<Customer>> GetAllCustomersWithUserAsync()
        {
            try
            {
                var customer = await dbSet.Include(r => r.User).ToListAsync();
                return customer.AsEnumerable();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Customer> GetCustomerByUsernameAsync(string customerName)
        {
            try
            {
                var customer = await dbSet
                                .Where(r => r.Name == customerName)
                                .FirstOrDefaultAsync();
                if (customer == null)
                {
                    throw new Exception("customer not found");
                }
                return customer;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<Customer> GetCustomerByUserIdAsync(string userId)
        {
            try
            {
                var customer = await dbSet
                                .Where(r => r.User.Id == userId)
                                .FirstOrDefaultAsync();
                if (customer == null)
                {
                    throw new Exception("customer not found");
                }
                return customer;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
        public async Task<Customer> GetCustomerWithRentedItems(Guid customerId)
        {
            try
            {
                var customer = await dbSet
               .Include(c => c.RentedItems)
               .FirstOrDefaultAsync(c => c.CustomerId == customerId);

                if (customer == null)
                {
                    throw new Exception("customer not found");
                }
                return customer;
            }
            catch (Exception)
            {

                throw;
            }
           
        }

        /*   public override bool IsExists(Guid id)
           {
               return base.IsExists(id);
           }*/

        /*     public override Task<Customer> UpdateAsync(Customer entity)
             {
                 try
                 {

                     if (entity == null)
                     {
                         throw new Exception("Renter not found");
                     }
                     dbSet.Update(entity);
                     return entity;
                 }
                 catch (Exception ex)
                 {
                     throw new Exception(ex.Message);
                 }
             }*/
    }
}
