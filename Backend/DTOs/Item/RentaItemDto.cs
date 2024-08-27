using RentItNow.DTOs.Customer;
using RentItNow.Enums;

namespace RentItNow.DTOs.Item
{
    public class RentaItemDto
    {
        public Guid RentalId { get; set; }
        public DateTimeOffset RentalStartDate { get; set; }
        public DateTimeOffset RentalEndDate { get; set; }
        public int RentalPrice { get; set; }
        public Boolean IsOverdue { get; set; } = false;
        public int OverdueDays { get; set; } = 0;
        public int Hours { get; set; }
        public string RentalStatus { get; set; }
        public Boolean isRentOver { get; set;}
        public Guid RentalOptionId { get; set; }
        public Guid CustomerId { get; set; }
        public GetCustomerDto? Customer { get; set; }
        public Guid ItemID { get; set; }
        public ItemDto? Item { get; set; }
        public Guid RenterId{ get; set; }

    }
}
