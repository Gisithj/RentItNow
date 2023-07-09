using System.ComponentModel.DataAnnotations;

namespace RentX.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public Renter? Renter { get; set; }
        public Customer? Customer { get; set; }
    }
}
