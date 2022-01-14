using System;
using System.Collections.Generic;
using System.Linq;
using Elasticsearch.Net;
using Nest;
using SearchServer.Model;
using SearchRequest = SearchServer.Model.SearchRequest;

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

        public SearchResult Search(SearchRequest request)
        {
            int startIndex = request.Page * request.PageSize;
            var response = _client.Search<SearchResultItemElasticMapping>(s => s
                .Query(q => q
                    .Bool(b => b
                        .Must(m => m
                            .QueryString(qs => qs
                                .Query("\"" + request.Query + "\"")))))
                .From(startIndex)
                .Size(request.PageSize)
                .Sort(q => request.Sort == "older"
                    ? q.Ascending(u => u.date)
                    : q.Descending(u => u.date)));
            return new SearchResult
            {
                items = response.Documents.ToList(),
                totalResults = response.Total,
                totalPages = (long)Math.Ceiling((double)response.Total / request.PageSize),
                currentPage = (long)((double)startIndex / request.PageSize),
            };
        }
    }
}