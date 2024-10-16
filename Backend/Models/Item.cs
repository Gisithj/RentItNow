﻿using RentItNow.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class Item
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;
        public string ItemOverview { get; set; } = string.Empty;
        public ICollection<RentalOption> RentalOptions { get; set; } = null!;
        public ICollection<ItemSpecification> Specifications { get; set; } = null!;
        public ICollection<ItemImage>? ImageURLs { get; set; }
        public Boolean IsRented { get; set; } = false;
        public RentalStatus RentalStatus { get; set; } = RentalStatus.Available;
        public ICollection<RentalItem> RentalItem { get; set; } = new List<RentalItem>();
        public Guid RenterId { get; set; }  = Guid.Empty;
        public Renter Renter { get; set; } = null!;
    }
}
