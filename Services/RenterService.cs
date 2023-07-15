using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentItNow.Core.Services;
using RentItNow.Data;
using RentItNow.Models;

namespace RentItNow.Services
{
    public class RenterService : IRenterService
    {
        private readonly RentItNowDbContext _context;

        public RenterService(RentItNowDbContext context)
        {
            _context = context;
        }

        public async Task<List<Renter>> GetRenters()
        {
            if(_context.Renters == null)
            {
                throw new Exception("context.Renter not found");
            }
            var user = await _context.Renters.ToListAsync();
            if(user.Count == 0)
            {
                return new List<Renter>();
            }   
            return  user;           
               
        }

        public async Task<Renter> GetRenterByUsername(string renterName)
        {
            if (_context.Renters == null)
            {
                throw new Exception("context.Renter not found");
            }
            var renter = await _context.Renters
                        .Where(r=>r.RenterName== renterName)
                        .FirstOrDefaultAsync();
            if (renter == null)
            {
                throw new Exception("renter not found");
            }
            return renter;

        }
        public async Task<Renter> GetRenterById(int id)
        {
            if (_context.Renters == null)
            {
                throw new Exception("context.Renter not found");
            }
            var renter = await _context.Renters.FindAsync(id);
            if (renter == null)
            {
                throw new Exception("renter not found");
            }
            return renter;

        }

        public async Task<Renter?> UpdateRenter(int id, Renter renter)
        {
            _context.Entry(renter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!RenterExists(id))
                {
                    return null;
                }
                else
                {
                    throw ex ;
                }
            }

            return renter;
        }

        public async Task<Renter> CreateRenter(Renter renter)
        {
            if (_context.Renters == null)
            {
                throw new Exception("context.Renter not found");
            }
            try
            {
                var renterCreated = _context.Renters.Add(renter);
                await _context.SaveChangesAsync();
                return renterCreated.Entity;
                
            }
            catch (Exception)
            {
                throw new Exception("renter creation failed");
            }
                
        }

        public async Task<bool> DeleteRenter(int id)
        {
            if (_context.Renters == null)
            {
                throw new Exception("context.Renter not found");
            }

            var renter = await _context.Renters.FindAsync(id);

            if (renter == null)
            {
                throw new Exception("renter not found");
            }
            _context.Renters.Remove(renter);
            await _context.SaveChangesAsync();

            return true;
        }

        private bool RenterExists(int id)
        {
            return (_context.Renters?.Any(e => e.RenterId == id)).GetValueOrDefault();
        }



    }

}

