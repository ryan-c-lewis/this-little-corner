using System.Collections.Generic;
using SearchServer.Model;

namespace SearchServer.RequestHandlers
{
    public class SearchRequestHandler
    {
        public SearchResult GetResponse(SearchRequest request)
        {
            SearchResult result = ElasticManager.Instance.Search(request);
            return CleanUp(request, result);
        }
        
        private SearchResult CleanUp(SearchRequest request, SearchResult result)
        {
            string lowerQuery = request.Query.ToLower();
            foreach (SearchResultItemElasticMapping item in result.items)
            {
                item.transcript_full = null;
                if (string.IsNullOrEmpty(request.Query))
                {
                    item.transcript_parts = new List<TranscriptPart>();
                    continue;
                }

                int latestMatch = -1;
                var groups = new List<TranscriptPartGroup>();
                for (int n = 4; n < item.transcript_parts.Count - 4; n++)
                {
                    string transcriptSection = item.transcript_parts[n].text.ToLower() + " "
                        + item.transcript_parts[n + 1].text.ToLower() + " "
                        + item.transcript_parts[n + 2].text.ToLower() + " "
                        + item.transcript_parts[n + 3].text.ToLower();

                    if (transcriptSection.Contains(lowerQuery))
                        latestMatch = n;
                    
                    if (latestMatch > -1 && latestMatch != n)
                    {
                        List<TranscriptPart> parts = new List<TranscriptPart>
                        {
                            item.transcript_parts[latestMatch - 4],
                            item.transcript_parts[latestMatch - 3],
                            item.transcript_parts[latestMatch - 2],
                            item.transcript_parts[latestMatch - 1],
                            item.transcript_parts[latestMatch],
                            item.transcript_parts[latestMatch + 1],
                            item.transcript_parts[latestMatch + 2],
                            item.transcript_parts[latestMatch + 3],
                            item.transcript_parts[latestMatch + 4],
                        };
                        groups.Add(new TranscriptPartGroup {transcriptParts = parts});
                        latestMatch = -1;
                    }
                }

                item.transcript_parts = new List<TranscriptPart>();
                item.transcriptPartGroups = groups;
            }

            return result;
        }
    }
}