using System.Collections.Generic;
using SearchServer.Model;

namespace SearchServer.RequestHandlers
{
    public class TranscriptRequestHandler
    {
        public SearchResultItemElasticMapping GetResponse(string videoId)
        {
            DataTracker.Log("TRANSCRIPT: " + videoId);
            SearchResultItemElasticMapping result = ElasticManager.Instance.SearchForOneVideo(videoId);
            result.transcriptData = new TranscriptData
            {
                transcriptPartGroups = new List<TranscriptPartGroup>
                {
                    new TranscriptPartGroup {transcriptParts = result.transcript_parts}
                }
            };
            return result;
        }
    }
}