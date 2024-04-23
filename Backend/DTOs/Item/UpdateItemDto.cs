using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.DTOs.Item
{
    public class UpdateItemDto
    {
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;
        public string ItemOverview { get; set; } = string.Empty;
        public Boolean IsRented { get; set; }
        public List<string> Images { get; set; } = null!;
        public List<RentalOptionDto> RentalOptions { get; set; } = null!;
        public List<ItemSpecDto> Specifications { get; set; } = null!;
    }
}
