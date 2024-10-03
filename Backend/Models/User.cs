using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class User: IdentityUser
    {
/*        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]*/
     /*   public Guid UserId { get; set; }*/
        public override string? PasswordHash { get; set; }
        public string PictureUrl { get; set; } = string.Empty;

    }
}
