using RentItNow.DTOs.RentalOption;

namespace RentItNow.Interfaces
{
    public interface IRentalOptionRepository
    {
        public Task<string> GetRentalOptionNameByIdAsync(Guid rentalOptionId);
        public Task<List<GetRentalOptionDto>> GetAllRentalOptions();
    }
}
