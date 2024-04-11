using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.DTOs.Rent;
using RentItNow.Interfaces;
using RentItNow.Models;
using System.Configuration;

namespace RentItNow.Repositories
{
    public class RenterRepository : GenericRepository<Renter>, IRenterRepository
    {
        public RenterRepository(RentItNowDbContext context) : base(context)
        {

        }

        public async Task<Renter> GetRenterByUsernameAsync(string renterName)
        {

            try
            {
                var renter = await dbSet
                                .Where(r => r.RenterName == renterName)
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

        public async Task<Renter> GetRenterByUserIdAsync(string userId)
        {

            try
            {
                var renter = await dbSet
                                .Where(r => r.User.Id == userId)
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
