using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class Admin
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid AdminId { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required] 
        public string Password { get; set; } = string.Empty;

    }
}
