namespace RentItNow.Models
{
    public class ItemSpecification
    {
        public Guid Id { get; set; }
        public string SpecificationFeature { get; set; } = string.Empty;
        public string FeatureDetail { get; set; } = string.Empty;
        public Guid ItemId { get; set; }
        public Item Item { get; set; } = null!;
    }
}
