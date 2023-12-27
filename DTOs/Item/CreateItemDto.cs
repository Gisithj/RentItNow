using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.DTOs.Item
{
    public class CreateItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;
        public int RentalPrice { get; set; }
        public Boolean IsRented { get; set; } 

    }
}
