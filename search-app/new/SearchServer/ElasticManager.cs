using System;
using System.Collections.Generic;
using Elasticsearch.Net;
using Nest;
using SearchServer.Model;

namespace SearchServer
{
    public class ElasticManager
    {
        private static ElasticManager _instance;
        public static ElasticManager Instance => _instance ??= new ElasticManager();

        private readonly ElasticClient _client;

        private ElasticManager()
        {
            var pool = new SingleNodeConnectionPool(new Uri("http://localhost:9200"));
            ConnectionSettings settings = new ConnectionSettings(pool)
                .DefaultIndex("this_little_corner");
            _client = new ElasticClient(settings);
        }

        public IEnumerable<Video> Search(string query)
        {
            var response = _client.Search<Video>(s => s.Query(q => q.QueryString(t => t.Query(query))));
            return response.Documents;
        }
    }
}