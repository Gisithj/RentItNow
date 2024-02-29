using RentItNow.Models;

namespace RentItNow.DTOs.Rent
{
    public class GetRenterDto
    {
        public Guid RenterId { get; set; }
        public string RenterName { get; set; } = string.Empty;
        public string RenterAddress { get; set; } = string.Empty;
        public string ContactNo { get; set; } = string.Empty;

    }
}
