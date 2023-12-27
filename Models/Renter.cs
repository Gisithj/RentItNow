﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class Renter
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RenterId { get; set; }
        public string RenterName { get; set;} = string.Empty;
        public string RenterAddress { get; set;} = string.Empty;
        public string ContactNo { get; set; } = string.Empty;
        public ICollection<Item?> Items { get; set; } = new List<Item?>();


        public Guid UserId { get; set; }
        public User User { get; set; } = null!;



    }
}
