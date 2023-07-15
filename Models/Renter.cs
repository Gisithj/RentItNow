using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class Renter
    {
        [Key]
        public int RenterId { get; set; }
        public string RenterName { get; set;} = string.Empty;
        public string RenterAddress { get; set;} = string.Empty;
        public string ContactNo { get; set; } = string.Empty;

        public User User { get; set; }
        public int UserId { get; set; }
        public ICollection<Item> Items { get; set; } = new List<Item>();
        
    }
}
