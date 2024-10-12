using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class ItemSpecification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string SpecificationFeature { get; set; } = string.Empty;
        public string FeatureDetail { get; set; } = string.Empty;
        public Guid ItemId { get; set; } = Guid.Empty;
        public Item Item { get; set; } = null!;
    }
}
