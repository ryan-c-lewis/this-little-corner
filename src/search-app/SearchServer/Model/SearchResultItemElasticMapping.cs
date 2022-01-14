using System;
using System.Collections.Generic;

namespace SearchServer.Model
{
    public class SearchResultItemElasticMapping
    {
        public string video_id { get; set; }
        public string channel_id { get; set; }
        public string channel_name { get; set; }
        public string title { get; set; }
        public string url { get; set; }
        public DateTime date { get; set; }
        public string description { get; set; }
        public double duration { get; set; }
        public string transcript_full { get; set; }
        public List<TranscriptPart> transcript_parts { get; set; }
        
        // TODO this wants to be a separate class
        public List<TranscriptPartGroup> transcriptPartGroups { get; set; }
    }
}