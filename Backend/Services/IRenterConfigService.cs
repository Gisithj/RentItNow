using RentItNow.Models;

namespace RentItNow.Services
{
    public interface IRenterConfigService
    {
        public Task<IEnumerable<RenterConfig>> GetConfiguration();
        public Task<RenterConfig> GetConfigByRenterAsync(Guid renterId);
        public Task<RenterConfig> UpdateConfiguration(RenterConfig config);
    }
}
