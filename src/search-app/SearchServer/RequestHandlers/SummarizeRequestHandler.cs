using System.Collections.Generic;
using SearchServer.Model;

namespace SearchServer.RequestHandlers
{
    public class SummarizeRequestHandler
    {
        public string GetResponse(string videoId)
        {
            DataTracker.Log("SUMMARIZE: " + videoId);
            SearchResultItemElasticMapping mapping = ElasticManager.Instance.SearchForOneVideo(videoId);
            return new GptManager().Summarize(mapping.transcript_full);
        }
    }
}