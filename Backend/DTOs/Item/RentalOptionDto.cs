namespace RentItNow.DTOs.Item
{
    public class RentalOptionDto
    {
        public Guid? Id { get; set; }
        public string RentalOptionName { get; set; } = string.Empty;
        public decimal Price { get; set; } = 0;
    }
}
