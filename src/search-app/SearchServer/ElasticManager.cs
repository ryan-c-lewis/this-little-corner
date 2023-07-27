using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
            string elasticUri = Environment.GetEnvironmentVariable("ES_URI") ?? "http://localhost/indexer";
            string elasticUsername = Environment.GetEnvironmentVariable("ES_USERNAME");
            string elasticPassword = Environment.GetEnvironmentVariable("ES_PASSWORD");
            string elasticTlsCrt = Environment.GetEnvironmentVariable("ES_TLS_CRT");

            var pool = new SingleNodeConnectionPool(new Uri(elasticUri));
            ConnectionSettings settings = new ConnectionSettings(pool).DefaultIndex("this_little_corner");

            if (elasticUsername != null && elasticPassword != null)
                settings = settings.BasicAuthentication(elasticUsername, elasticPassword);
            if (elasticTlsCrt != null)
                settings = settings.ClientCertificate(elasticTlsCrt);

            _client = new ElasticClient(settings);
        }

        public class QueryPart
        {
            public string Field { get; set; }
            public string Query { get; set; }
            public bool Exact { get; set; }
        }

        public static IEnumerable<QueryPart> GetParts(string query)
        {
            var currentPart = new StringBuilder();
            bool currentlyInQuotes = false;
            string currentField = null;
            foreach (char c in query)
            {
                if (c == '(')
                {
                    string currentPartClean = currentPart.ToString().Trim();
                    if (currentPartClean.Contains(" "))
                    {
                        string queryMinusField = string.Join(" ", currentPartClean.Split(' ').Reverse().Skip(1).Reverse());
                        yield return new QueryPart {Field = currentField, Query = queryMinusField.Trim(), Exact = false};
                        currentField = currentPartClean.Split(' ').Last();
                        currentPart = new StringBuilder();
                    }
                    else
                    {
                        currentField = currentPart.ToString().Trim();
                        currentPart = new StringBuilder();
                        continue;
                    }
                }
                else if (c == ')')
                {
                    if (currentPart.ToString().Trim().Length > 0)
                    {
                        yield return new QueryPart {Field = currentField, Query = currentPart.ToString().Trim(), Exact = false};
                        currentPart = new StringBuilder();
                    }

                    currentField = null;
                }
                else if (c == '"')
                {
                    if (currentlyInQuotes)
                    {
                        currentlyInQuotes = false;
                        yield return new QueryPart { Field = currentField, Query = currentPart.ToString().Trim(), Exact = true};
                        currentPart = new StringBuilder();
                        continue;
                    }
                    else
                    {
                        currentlyInQuotes = true;
                        if (currentPart.ToString().Trim().Length > 0)
                        {
                            yield return new QueryPart { Field = currentField, Query = currentPart.ToString().Trim(), Exact = false};
                            currentPart = new StringBuilder();
                        }
                        else
                        {
                            continue;
                        }
                    }
                }
                else
                {
                    currentPart.Append(c);
                }
            }

            if (currentPart.ToString().Trim().Length > 0)
            {
                yield return new QueryPart {Field = currentField, Query = currentPart.ToString().Trim(), Exact = false};
                currentPart = new StringBuilder();
            }
        }
        
        public SearchResult SearchForMostRelevant(SearchRequest request)
        {
            string query = string.IsNullOrEmpty(request.Query)
                ? ""
                : request.Query;
            int startIndex = request.Page * request.PageSize;

            var queries = new List<Func<QueryContainerDescriptor<SearchResultItemElasticMapping>, QueryContainer>>();
            foreach (QueryPart part in GetParts(query))
            {
                /*
                 * // m =>
                                // {
                                //     return m.QueryString(qs => qs.Query("hollywood").Fields(f => f.Field("title")));
                                // },
                                
                                m =>
                                {
                                    if (!query.Contains("\""))
                                        return m.QueryString(qs => qs.Query("\"" + query + "\"").Boost(20)) || m.QueryString(qs => qs.Query(query));
                                    return m.QueryString(qs => qs.Query(query));
                                },

                                m =>
                                {
                                    if (string.IsNullOrEmpty(request.Channel) || request.Channel == "all")
                                        return m;
                                    return m.Match(x => x.Field("channel_id").Query(request.Channel));
                                }
                 */
                queries.Add(m =>
                {
                    Func<FieldsDescriptor<SearchResultItemElasticMapping>, IPromise<Fields>> fields = f => f;
                    if (!string.IsNullOrEmpty(part.Field))
                        fields = f => f.Field(part.Field);
                    
                    if (part.Exact)
                    {
                        return m.QueryString(qs => qs.Query(part.Query).Fields(fields));
                    }
                    else
                    {
                        return m.QueryString(qs => qs.Query("\"" + part.Query + "\"").Fields(fields).Boost(20)) || m.QueryString(qs => qs.Query(part.Query).Fields(fields));
                    }
                });

                if (!string.IsNullOrEmpty(request.Channel) && request.Channel != "all")
                {
                    queries.Add(m =>
                    {
                        return m.Match(x => x.Field("channel_id").Query(request.Channel));
                    });
                }
            }
            
            var response = _client.Search<SearchResultItemElasticMapping>(s =>
            {
                s
                    .Query(q => q
                        .Bool(b => b
                            .Must(queries)))
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
}