using System;
using System.Collections.Generic;

namespace SearchServer.Model
{
    public class Video
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
        public IEnumerable<TranscriptPart> transcript_parts { get; set; }
    }
}