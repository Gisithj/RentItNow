using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class RentalOption
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string RentalOptionName { get; set; } = string.Empty;
        public int Price { get; set; } = 0;
        public Guid ItemId { get; set; } = Guid.Empty;
        public Item Item { get; set; } = null!;
    }
}
