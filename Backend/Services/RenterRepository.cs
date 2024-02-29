using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.DTOs.Rent;
using RentItNow.Models;
using RentItNow.Repository;
using System.Configuration;

namespace RentItNow.Services
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


    }
}
