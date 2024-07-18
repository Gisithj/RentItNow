using RentItNow.DTOs.Customer;

namespace RentItNow.DTOs.Item
{
    public class RentItemDto
    {
        public Guid RentalId { get; set; }
        public DateTimeOffset RentalStartDate { get; set; }
        public DateTimeOffset RentalEndDate { get; set; }
        public int Hours { get; set; }
        public Boolean isRentOver { get; set;}
        public Guid RentalOptionId { get; set; }
        public Guid CustomerId { get; set; }
        public GetCustomerDto? Customer { get; set; }
        public Guid ItemID { get; set; }
        public ItemDto? Item { get; set; }
        public Guid RenterId{ get; set; }

    }
}
