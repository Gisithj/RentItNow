namespace RentItNow.DTOs.Item
{
    public class RentalRequestDto
    {
        public DateTimeOffset RentalStartDate { get; set; }
        public DateTimeOffset RentalEndDate { get; set; }
        public int RentalPrice { get; set; }
        public int Hours { get; set; }
        public Guid RentalOptionId { get; set; }
        public Guid CustomerId { get; set; }
        public Guid ItemID { get; set; }
        public Guid RenterId { get; set; }
    }
}
