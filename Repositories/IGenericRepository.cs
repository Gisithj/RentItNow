using Microsoft.AspNetCore.Mvc;
using RentItNow.Models;
using System.Linq.Expressions;

namespace RentItNow.Repository
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(Guid id);
        Task<T> AddAsync(T entity);
        Task<bool> DeleteAsync(Guid id);
        Task<T> UpdateAsync(T entity);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        bool IsExists(Guid id);
    }
}
