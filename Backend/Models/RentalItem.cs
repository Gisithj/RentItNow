﻿using RentItNow.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class RentalItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RentalId { get; set; }
        public DateTimeOffset RentalStartDate { get; set; }
        public DateTimeOffset RentalEndDate { get; set; }
        public int rentalPrice { get; set; } = 0;
        public Boolean isOverdue { get; set; } = false;
        public int overdueDays { get; set; } = 0;
        public int Hours { get; set; }  = 0;
        public Boolean isRentOver { get; set; } = false;
        public RentalStatus RentalStatus { get; set; } = RentalStatus.Available;
        public Guid RentalOptionId { get; set; } = Guid.Empty;
        public Guid CustomerId { get; set; } = Guid.Empty;
        public Customer Customer { get; set; } = null!;

        public Guid ItemID { get; set; } = Guid.Empty;
        public Item Item { get; set; } = null!;
        public Guid RenterId { get; set; } = Guid.Empty;
        public Renter Renter { get; set; } = null!;
    }
}
