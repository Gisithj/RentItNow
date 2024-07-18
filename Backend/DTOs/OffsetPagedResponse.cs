using RentItNow.DTOs.Item;
namespace RentItNow.DTOs

{
    public record OffsetPagedResponse<T> where T : class
    {
        public List<T> Items { get; set; } = new List<T>();
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int PageNumber { get; set; }
        public bool HasPreviousPage { get; set; }
        public bool HasNextPage { get; set; }

        public OffsetPagedResponse(List<T> items, int pageSize, int totalCount, int pageNumber)
        {
            Items = items;
            PageSize = pageSize;
            TotalCount = totalCount;
            TotalPages = (int)Math.Ceiling(totalCount / (decimal)pageSize);
            PageNumber = pageNumber;
            HasPreviousPage = pageNumber > 1;
            HasNextPage = pageNumber < TotalPages;
        }

    }
}
