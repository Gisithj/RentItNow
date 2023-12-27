using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Models;
using RentItNow.Repositories;
using System.Linq.Expressions;

namespace RentItNow.Services
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(RentItNowDbContext context) : base(context)
        {
        }

/*        public override async Task<Customer> AddAsync(Customer entity)
        {
            try
            {
                var customer = await dbSet.AddAsync(entity);
                return customer.Entity;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }*/

      /*  public override Task<bool> DeleteAsync(Guid id)
        {
            return base.DeleteAsync(id);
        }*/

/*        public override Task<IEnumerable<Customer>> FindAsync(Expression<Func<Customer, bool>> predicate)
        {
            return base.FindAsync(predicate);
        }*/

/*        public override async Task<IEnumerable<Customer>> GetAllAsync()
        {
            try
            {
                var customers = await dbSet.ToListAsync();
                if (customers.Count == 0)
                {
                    throw new Exception("Customers not found");
                }
                return customers;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }*/

/*        public override async Task<Customer> GetByIdAsync(Guid id)
        {
            try
            {
                var customer = await dbSet.FindAsync(id);
                if (customer == null)
                {
                    throw new Exception("Customer not found");
                }
                return customer;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }*/

        public async Task<Customer> GetCustomerByUsernameAsync(string customerName)
        {
            try
            {
                var customer = await dbSet
                                .Where(r => r.Name == customerName)
                                .FirstOrDefaultAsync();
                if (customer == null)
                {
                    throw new Exception("renter not found");
                }
                return customer;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
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
