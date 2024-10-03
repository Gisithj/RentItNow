namespace RentItNow.Models
{
    public class RenterConfig
    {
        public Guid Id { get; set; }
        public int overdueChargePerDay { get; set; } = 200;
        public int overdueNotificationIntervalInHours { get; set; } = 24;

        public Guid RenterId { get; set; }
        public Renter Renter { get; set; }
    }
}
