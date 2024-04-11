namespace RentItNow.Models
{
    public class RentalOption
    {
        public Guid Id { get; set; }
        public string RentalOptionName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public Guid ItemId { get; set; } 
        public Item Item { get; set; } = null!;
    }
}
