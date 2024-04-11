using Microsoft.AspNetCore.Identity;
using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        public Task<User> GetUserByUsernameAsync(string renterName);
        public Task<User> GetUserByEmailAsync(string email);
        public Task<IEnumerable<string>> GetRolesByUserAsync(User user);
        public Task<IdentityResult> CreateUserAsync(User user, string? password);
        public Task<IdentityResult> CreateUserAsync(User user);

    }
}
