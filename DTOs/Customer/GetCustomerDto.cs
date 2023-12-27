using RentItNow.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.DTOs.Customer
{
    public class GetCustomerDto
    {
        
        public Guid CustomerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ContactNo { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        public Guid UserId { get; set; }
     
    }
}
