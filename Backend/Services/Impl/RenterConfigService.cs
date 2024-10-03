using RentItNow.configurations;
using RentItNow.Models;

namespace RentItNow.Services.Impl
{
    public class RenterConfigService : IRenterConfigService
    {
        private readonly IUnitOfWork _unitOfWork;
        public RenterConfigService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<RenterConfig>> GetConfiguration()
        {
            try
            {
                 return await _unitOfWork.RenterConfig.GetConfiguration();

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
                return await _unitOfWork.RenterConfig.GetConfigByRenterAsync(renterId);
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
               var updatedConfig = await _unitOfWork.RenterConfig.UpdateConfiguration(config);
                await _unitOfWork.CompleteAsync();
                return updatedConfig;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }


    }
}
