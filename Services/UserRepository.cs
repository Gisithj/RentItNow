using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Models;
using RentItNow.Repositories;
using System.Configuration;

namespace RentItNow.Services
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public UserRepository(RentItNowDbContext context, UserManager<User> userManager, SignInManager<User> signInManager) : base(context)
        {
            _userManager= userManager;
            _signInManager= signInManager;
        }

        public async override Task<IEnumerable<User>> GetAllAsync()
        {
            try
            {
                var users = await dbSet.ToListAsync();
                if (users.Count == 0)
                {
                    throw new Exception("Users not found");
                }
                return users;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<User> GetRenterByUsernameAsync(string userName)
        {

            try
            {
                var user = await dbSet
                                .Where(r => r.UserName == userName)
                                .FirstOrDefaultAsync();
                if (user == null)
                {
                    throw new Exception("User not found");
                }
                return user;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }

        public async override Task<User> GetByIdAsync(Guid id)
        {
            try
            {
                var user = await dbSet.FindAsync(id);
                if (user == null)
                {
                    throw new Exception("User not found");
                }
                return user;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

/*        public async override Task<User> AddAsync(User entity)
        {
            try
            {
                var user = await dbSet.AddAsync(entity);
                return user.Entity;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }*/
        public async Task<IdentityResult> CreateUserAsync(User user,string password)
        {
            try
            {
                var userCreated = await _userManager.CreateAsync(user, password);
                return userCreated;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
       

        public async override Task<User> UpdateAsync(User entity)
        {
            try
            {
                var user = await dbSet.FindAsync(entity);

                if (user == null)
                {
                    throw new Exception("User not found");
                }
                dbSet.Update(user);
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async override Task<bool> DeleteAsync(Guid id)
        {
            try
            {
                var user = await dbSet.FindAsync(id);
                if (user == null)
                {
                    throw new Exception("User not found");
                }
                dbSet.Remove(user);
                return true;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public override bool IsExists(Guid id)
        {
            var user = dbSet.FindAsync(id);
            if (user.Result != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {

            try
            {
                var renter = await dbSet
                                .Where(r => r.UserName == username)
                                .FirstOrDefaultAsync();
                if (renter == null)
                {
                    throw new Exception("renter not found");
                }
                return renter;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }
    }
}
