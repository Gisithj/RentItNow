namespace RentItNow.Models
{
    public class ItemImage
    {
        public Guid Id { get; set; }
        public string ImageURL { get; set; } = string.Empty;
        public Guid ItemId { get; set; }
        public Item Item { get; set; } = null!;
    }
}
