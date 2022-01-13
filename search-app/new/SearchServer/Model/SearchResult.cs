using System.Collections.Generic;

namespace SearchServer.Model
{
    public class SearchResult
    {
        public List<SearchResultItem> items { get; set; }
        public long totalResults { get; set; }
        public long totalPages { get; set; }
        public long currentPage { get; set; }
    }
}