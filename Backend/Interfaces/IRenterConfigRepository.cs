using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface IRenterConfigRepository: IGenericRepository<RenterConfig>
    {
        public Task<IEnumerable<RenterConfig>> GetConfiguration();
        public Task<RenterConfig> GetConfigByRenterAsync(Guid renterId);
        public Task<RenterConfig> UpdateConfiguration(RenterConfig config);
    }
}
