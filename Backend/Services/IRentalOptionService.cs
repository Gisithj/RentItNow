using RentItNow.DTOs.RentalOption;

namespace RentItNow.Services
{
    public interface IRentalOptionService
    {
        public Task<List<GetRentalOptionDto>> GetAllRentalOptions();
        public Task<string> GetRentalOptionNameByIdAsync(Guid rentalOptionId);
    }
}
