using System.Collections.Generic;
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
            return JsonConvert.SerializeObject(results);
        }
    }
}