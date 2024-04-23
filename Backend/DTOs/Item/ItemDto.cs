namespace RentItNow.DTOs.Item
{
    public class ItemDto
    {
      
            public Guid ItemId { get; set; }
            public string ItemName { get; set; }
            public string Category { get; set; } = string.Empty;
            public string ItemDescription { get; set; } = string.Empty;
            public string ItemOverview { get; set; } = string.Empty;
            public bool IsRented { get; set; }
            public Guid RenterId { get; set; }
            public List<string>? ImageURLs { get; set; }
            public ICollection<RentalOptionDto> RentalOptions { get; set; }
            public ICollection<ItemSpecDto>? Specifications { get; set; }
        
    }
}
