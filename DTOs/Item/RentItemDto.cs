namespace RentItNow.DTOs.Item
{
    public class RentItemDto
    {
        public DateTime RentalStartDate { get; set; }
        public DateTime RentalEndDate { get; set; }

        public Guid CustomerId { get; set; }
        public Guid ItemID { get; set; }

    }
}
