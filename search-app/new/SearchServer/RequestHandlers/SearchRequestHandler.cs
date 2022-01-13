using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using SearchServer.Model;

namespace SearchServer.RequestHandlers
{
    public class SearchRequestHandler
    {
        private readonly string _query;
        
        public SearchRequestHandler(string query)
        {
            _query = query;
        }

        public string GetResponse()
        {
            IEnumerable<Video> results = ElasticManager.Instance.Search(_query);
            foreach (Video result in results)
            {
                result.transcript_full = null;
                result.transcript_parts = result.transcript_parts.Take(20);
            }
            return JsonConvert.SerializeObject(results);
        }
    }
}