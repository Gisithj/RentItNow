using System.ComponentModel.DataAnnotations;

namespace RentItNow.Models
{
    public class Item
    {
        [Key]
        public int ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;
        public Boolean IsRented { get; set; }
        public Renter Renter { get; set; }
        public int RenterId { get; set; }
    }
}
