namespace SearchServer.Model
{
    public class SearchRequest
    {
        public string Query { get; set; }
        public string Sort { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}