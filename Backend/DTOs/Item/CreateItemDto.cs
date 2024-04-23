using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.DTOs.Item
{
    public class CreateItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public string Category {  get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;
        public string ItemOverview { get; set; } = string.Empty;
        public List<RentalOptionDto> RentalOptions { get; set; } = null!;
        public List<ItemSpecDto> Specifications { get; set; } = null!;
        public List<string> Images { get; set; } = null!;
        public Boolean IsRented { get; set; }
        public Guid RenterId { get; set; }
    }
}
