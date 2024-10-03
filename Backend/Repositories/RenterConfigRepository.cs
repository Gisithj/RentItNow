

using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;

namespace RentItNow.Repositories
{
    public class RenterConfigRepository : GenericRepository<RenterConfig>, IRenterConfigRepository
    {
        public RenterConfigRepository(RentItNowDbContext context,ILogger<GenericRepository<RenterConfig>> logger) : base(context, logger)
        {
        }

        public async Task<IEnumerable<RenterConfig>> GetConfiguration()
        {
            try
            {
                var config = await dbSet.AsNoTracking().ToListAsync();
                return config;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public async Task<RenterConfig> GetConfigByRenterAsync(Guid renterId)
        {
            try
            {
                var config = await dbSet.Where(c=>c.RenterId == renterId).AsNoTracking().FirstOrDefaultAsync();
                return config;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);

            }
        }
        public async Task<RenterConfig> UpdateConfiguration(RenterConfig config)
        {
            try
            {
                dbSet.Update(config);
                return config;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
