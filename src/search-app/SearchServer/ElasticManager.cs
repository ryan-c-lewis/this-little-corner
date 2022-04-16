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
            string elasticUri = Environment.MachineName.Contains("DESKTOP-SPEU90N")
                ? "http://this-little-corner-elastic.ngrok.io/" // my local elastic is borked and i don't care why right now
                : "http://localhost:9200";
            var pool = new SingleNodeConnectionPool(new Uri(elasticUri));
            ConnectionSettings settings = new ConnectionSettings(pool)
                .DefaultIndex("this_little_corner");
            _client = new ElasticClient(settings);
        }

        public SearchResult Search(SearchRequest request)
        {
            string query = string.IsNullOrEmpty(request.Query)
                ? ""
                : "\"" + request.Query + "\"";
            int startIndex = request.Page * request.PageSize;
            
            var response = _client.Search<SearchResultItemElasticMapping>(s => s
                .Query(q => q
                    .Bool(b => b
                        .Must(
                            m => m.QueryString(qs => qs.Query(query)),
                            m =>
                            {
                                if (string.IsNullOrEmpty(request.Channel) || request.Channel == "all")
                                    return m;
                                return m.Match(x => x.Field("channel_id").Query(request.Channel));
                            }
                        )))
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
        
        public SearchResultItemElasticMapping SearchForOneVideo(string videoId)
        {
            var response = _client.Search<SearchResultItemElasticMapping>(s => s
                .Query(q => q
                    .Match(m => m.Field(f => f.video_id).Query(videoId))));
            return response.Documents.Any() ? response.Documents.First() : null;
        }
    }
    
    public static class ElasticManagerExtensions {
    
    }
}