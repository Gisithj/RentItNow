using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Repository;
using System.Linq.Expressions;

namespace RentItNow.Services
{
    public class GenericRepository<T> :IGenericRepository<T> 
        where T : class
    {
        protected RentItNowDbContext _context;
        internal DbSet<T> dbSet;
        public GenericRepository(RentItNowDbContext context)
        {
            _context = context;
            dbSet = context.Set<T>();
        
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            return await dbSet.FindAsync(id);
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await dbSet.AddAsync(entity);
            throw new NotImplementedException();
        }

        public virtual async Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            throw new NotImplementedException();
        }

        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await dbSet.Where(predicate).ToListAsync();
        }

        public virtual bool IsExists(int id)
        {
            throw new NotImplementedException();
        }
    }
}
