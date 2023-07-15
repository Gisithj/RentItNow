using System.ComponentModel.DataAnnotations;

namespace RentItNow.Models
{
    public class Customer
    {
        [Required]
        [Key]
        public int CustomerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ContactNo { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        public User User { get; set; }
        public int UserId { get; set; }
        public ICollection<RentItem>? RentItems { get; set; }

                
    }
}
