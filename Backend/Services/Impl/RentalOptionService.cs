using RentItNow.configurations;
using RentItNow.DTOs.RentalOption;
using RentItNow.Interfaces;

namespace RentItNow.Services.Impl
{
    public class RentalOptionService:IRentalOptionService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RentalOptionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<GetRentalOptionDto>> GetAllRentalOptions()
        {
            return await _unitOfWork.RentalOption.GetAllRentalOptions();
        }
        public async Task<string> GetRentalOptionNameByIdAsync(Guid rentalOptionId)
        {
            return await _unitOfWork.RentalOption.GetRentalOptionNameByIdAsync(rentalOptionId);
        }
    }
}
