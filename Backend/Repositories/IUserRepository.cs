using Microsoft.AspNetCore.Identity;
using RentItNow.Models;
using RentItNow.Repository;

namespace RentItNow.Repositories
{
    public interface IUserRepository:IGenericRepository<User>
    {
        public Task<User> GetUserByUsernameAsync(string renterName);
        public Task<User> GetUserByEmailAsync(string email);

        public Task<IdentityResult> CreateUserAsync(User user,string? password);
        public Task<IdentityResult> CreateUserAsync(User user);

    }
}
