using System.ComponentModel.DataAnnotations;

namespace RentItNow.Models
{
    public class RentItem
    {
        [Key]
        public int RentId { get; set; }
        public int ItemID { get; set; }
        public int CustomerId { get; set; }
        public int RenterId { get; set; }
        public Item item { get; set; }
        public Customer Customer { get; set; }
        public Renter Renter { get; set; }
    }
}
