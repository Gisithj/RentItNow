using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class RenterConfig
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public int overdueChargePerDay { get; set; } = 200;
        public int overdueNotificationIntervalInHours { get; set; } = 24;

        public Guid RenterId { get; set; }
        public Renter Renter { get; set; }
    }
}
