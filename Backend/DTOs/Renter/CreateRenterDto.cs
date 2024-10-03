using RentItNow.Models;
using System.ComponentModel.DataAnnotations;

namespace RentItNow.DTOs.Renter
{
    public class CreateRenterDto
    {
        public string RenterName { get; set; } = string.Empty;
        public string RenterAddress { get; set; } = string.Empty;
        public string ContactNo { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? PictureUrl { get; set; } 
    }
}
