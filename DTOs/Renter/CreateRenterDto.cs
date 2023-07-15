using RentItNow.Models;
using System.ComponentModel.DataAnnotations;

namespace RentItNow.DTOs.Renter
{
    public class CreateRenterDto
    {
        [Key]
        public int RenterId { get; set; }
        public string RenterName { get; set; } = string.Empty;
        public string RenterAddress { get; set; } = string.Empty;
        public string ContactNo { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}
