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
        public RenterRepository(RentItNowDbContext context, IMapper mapper) : base(context, mapper)
        {

        }

        public async override Task<IEnumerable<Renter>> GetAllAsync()
        {
            try
            {
                var renters =  await dbSet.ToListAsync();
                if (renters.Count == 0)
                {
                    throw new Exception("Renters not found");
                }
                return renters;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async override Task<Renter> AddAsync(Renter entity)
        {
            try
            {
                var renter = await dbSet.AddAsync(entity);
                return renter.Entity;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async override Task<Renter> GetByIdAsync(int id)
        {
            try
            {
                var renter =  await dbSet.FindAsync(id);
                if(renter== null)
                {
                    throw new Exception("Renternot found");
                }
                return renter;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
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

        public async override Task<bool> DeleteAsync(int id)
        {
            try
            {
                var renter = await dbSet.FindAsync(id);
                if (renter == null)
                {
                    throw new Exception("Renter not found");
                }
                dbSet.Remove(renter);
                return true;
            }
            catch (Exception)
            {

                throw ;
            }
        }

        public async override Task<Renter> UpdateAsync(Renter entity)
        {
            try
            {
                var renter = await dbSet.FindAsync(entity);

                if (renter == null)
                {
                    throw new Exception();
                }
                dbSet.Update(renter);
                return renter;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public override bool IsExists(int id)
        {
            var renter =  dbSet.FindAsync(id);
            if(renter != null)
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
