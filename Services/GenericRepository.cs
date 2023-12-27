using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
            try
            {
                var entities = await dbSet.ToListAsync();
                if (entities.Count == 0)
                {
                    throw new Exception("Entities not found");
                }
                return entities;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public virtual async Task<T> GetByIdAsync(Guid id)
        {
            try
            {
                var renter = await dbSet.FindAsync(id);
                if (renter == null)
                {
                    throw new Exception("Entity not found by id");
                }
                return renter;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            try
            {
                var addedEntity = await dbSet.AddAsync(entity);
                return addedEntity.Entity;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public virtual async Task<bool> DeleteAsync(Guid id)
        {
            try
            {
                var entity = await dbSet.FindAsync(id);
                if (entity == null)
                {
                    throw new Exception("Entity not found to delete");
                }
                dbSet.Remove(entity);
                return true;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            try
            {
                if (entity == null)
                {
                    throw new Exception("Entity not found to update");
                }
                dbSet.Update(entity);
                return entity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await dbSet.Where(predicate).ToListAsync();
        }


        public virtual bool IsExists(Guid id)
        {
            var entity = dbSet.FindAsync(id);
            if (entity.Result != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
