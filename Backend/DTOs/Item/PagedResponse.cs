namespace RentItNow.DTOs.Item
{
    public class PagedResponse<T> where T: class
    {
        public List<T> Items { get; set; } = new List<T>();
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int PageNumber { get; set; }
        public bool HasPreviousPage { get; set; }
        public bool HasNextPage { get; set; }
    }
}
