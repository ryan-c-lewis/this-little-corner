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

        public SearchResult SearchForExactMatches(SearchRequest request)
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
        
        public SearchResult SearchForMostRelevant(SearchRequest request)
        {
            string query = string.IsNullOrEmpty(request.Query)
                ? ""
                : request.Query;
            int startIndex = request.Page * request.PageSize;
            
            var response = _client.Search<SearchResultItemElasticMapping>(s =>
            {
                s
                    .Query(q => q
                        .Bool(b => b
                            .Must(
                                m =>
                                {
                                    if (!query.Contains("\""))
                                        return m.QueryString(qs => qs.Query("\"" + query + "\"").Boost(5)) || m.QueryString(qs => qs.Query(query));
                                    return m.QueryString(qs => qs.Query(query));
                                },
                                
                                m =>
                                {
                                    if (string.IsNullOrEmpty(request.Channel) || request.Channel == "all")
                                        return m;
                                    return m.Match(x => x.Field("channel_id").Query(request.Channel));
                                }
                            )))
                    .From(startIndex)
                    .Size(request.PageSize)
                    .Highlight(h => h
                        .PreTags("")
                        .PostTags("")
                        .Encoder(HighlighterEncoder.Default)
                        .Fields(f => f
                            .Field(e => e.transcript_full))
                        .FragmentSize(30))
                    .TrackScores()
                    .MinScore(4.0);

                if (request.Sort == "older")
                {
                    s.Sort(q => q.Ascending(u => u.date));
                }
                else if (request.Sort == "newer")
                {
                    s.Sort(q => q.Descending(u => u.date));
                }
                
                return s;
            });
            
            var result = new SearchResult
            {
                items = response.Documents.ToList(),
                totalResults = response.Total,
                totalPages = (long)Math.Ceiling((double)response.Total / request.PageSize),
                currentPage = (long)((double)startIndex / request.PageSize),
            };
            for (int n = 0; n < response.Hits.Count; n++)
            {
                result.items[n].toHighlight = response.Hits.ToList()[n].Highlight.Values.FirstOrDefault()?.ToList() ?? new List<string>();
            }
            return result;
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