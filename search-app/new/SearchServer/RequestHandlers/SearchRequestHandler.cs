using System.Linq;
using SearchServer.Model;

namespace SearchServer.RequestHandlers
{
    public class SearchRequestHandler
    {
        public SearchResult GetResponse(SearchRequest request)
        {
            SearchResult result = ElasticManager.Instance.Search(request);
            foreach (SearchResultItem item in result.items)
            {
                item.transcript_full = null;
                item.transcript_parts = item.transcript_parts.Take(20);
            }
            return result;
        }
    }
}