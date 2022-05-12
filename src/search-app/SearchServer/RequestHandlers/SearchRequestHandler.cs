using System.Collections.Generic;
using System.Linq;
using SearchServer.Model;

namespace SearchServer.RequestHandlers
{
    public class SearchRequestHandler
    {
        public SearchResult GetResponse(SearchRequest request)
        {
            DataTracker.Log("QUERY: " + request.Query);
            SearchResult result = ElasticManager.Instance.SearchForMostRelevant(request);
            return CleanUp(request, result);
        }
        
        private SearchResult CleanUp(SearchRequest request, SearchResult result)
        {
            string lowerQuery = request.Query.ToLower().Replace("\"", "");
            foreach (SearchResultItemElasticMapping item in result.items)
            {
                item.transcript_full = null;
                if (string.IsNullOrEmpty(request.Query))
                {
                    item.transcript_parts = new List<TranscriptPart>();
                    continue;
                }

                var groups = new List<TranscriptPartGroup>();
                GatherForQuery(item, lowerQuery, groups);
                
                foreach(string highlight in item.toHighlight)
                    GatherForQuery(item, highlight, groups);

                groups = groups.OrderBy(x => x.transcriptParts.FirstOrDefault()?.start ?? 0).ToList();
                item.transcript_parts = new List<TranscriptPart>();
                item.transcriptData = new TranscriptData {transcriptPartGroups = groups};
            }

            return result;
        }

        private static void GatherForQuery(SearchResultItemElasticMapping item, string lowerQuery, List<TranscriptPartGroup> groups)
        {
            int latestMatch = -1;
            for (int n = 4; n < item.transcript_parts.Count - 4; n++)
            {
                string transcriptSection = item.transcript_parts[n].text.ToLower() + " "
                    + item.transcript_parts[n + 1].text
                        .ToLower() + " "
                    + item.transcript_parts[n + 2].text
                        .ToLower() + " "
                    + item.transcript_parts[n + 3].text
                        .ToLower();

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
        }

        // private void GatherForHighlights(SearchResultItemElasticMapping item, List<TranscriptPartGroup> groups)
        // {
        //     foreach (string highlight in item.toHighlight)
        //     {
        //         int n = item.transcript_full.IndexOf(highlight);
        //         if (n < 0)
        //             continue;
        //         
        //         
        //     }
        // }
    }
}