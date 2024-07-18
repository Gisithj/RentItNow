using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RentItNow.Data;
using RentItNow.Interfaces;
using System.Linq.Expressions;

namespace RentItNow.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T>
        where T : class
    {
        protected RentItNowDbContext _context;
        internal DbSet<T> dbSet;
        protected readonly ILogger<GenericRepository<T>> _logger;
        public GenericRepository(RentItNowDbContext context, ILogger<GenericRepository<T>> logger)
        {
            _context = context;
            dbSet = context.Set<T>();
            _logger = logger;
        }

        public virtual async Task<IEnumerable<T>?> GetAllAsync()
        {
            try
            {
                var entities = await dbSet.ToListAsync();
                if (entities.Count == 0 || entities == null)
                {
                    return null;
                }
                return entities;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public virtual async Task<IEnumerable<T>> GetOffSetPaginationAsync(int pageNumber, int pageSize, params Expression<Func<T, object>>[] includes)
        {
            try
            {
                IQueryable<T> query = dbSet.AsNoTracking();

                // Apply includes
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }

                // Apply pagination
                var entities = await query
                                    .Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

                return entities;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public virtual async Task<IEnumerable<T>> GetOffSetPaginationAsync(int pageNumber, int pageSize, IQueryable<T> query)
        {
            try
            {
                // Apply pagination
                var entities = await query
                   .Skip((pageNumber - 1) * pageSize)
                   .Take(pageSize)
                   .ToListAsync();

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
                    return false;
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


        public async Task<bool> UpdateFieldAsync<TField>(Guid id, string fieldName, TField newFieldValue)
        {
            var entityToUpdate = await dbSet.FindAsync(id);

            if (entityToUpdate == null)
            {
                return false; // Entity not found
            }

            // Use reflection to set the new field value
            var property = entityToUpdate.GetType().GetProperty(fieldName);
            if (property != null && property.CanWrite && property.PropertyType == typeof(TField))
            {
                property.SetValue(entityToUpdate, newFieldValue);
                return true; // Update successful
            }

            return false; // Field not found or invalid
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
