using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using SearchServer.Model;
using SearchServer.RequestHandlers;
using YoutubeTranscriptApi;
using Channel = SearchServer.Model.Channel;

namespace SearchServer
{
    public class YoutubeManager
    {
        private const int CONSECUTIVE_ALREADY_INDEXED_MAX = 5;
        private const int CONSECUTIVE_ERROR_MAX = 5;

        private readonly bool _reindexAll;
        private readonly string _youtubeApiKey;

        private bool _tooManyErrors;

        private static Timer _timer;
        public static void IndexEveryHour()
        {
            if (_timer != null)
                return;
            
            _timer = new Timer(60 * 60 * 1000);
            _timer.Elapsed += (sender, args) => new YoutubeManager().Index();
            _timer.Start();
            
            new YoutubeManager().Index();
        }
        
        public YoutubeManager(bool reindexAll = false)
        {
            _reindexAll = reindexAll;
            _youtubeApiKey = new SecretsManager().GetSecret(SecretsManager.YOUTUBE_API_KEY);
        }
        
        public void Index()
        {
            DataTracker.Log("Indexing...");
            foreach (Channel channel in new ChannelsRequestHandler().GetChannels())
            {
                IndexChannel(channel.Id);
                if (_tooManyErrors)
                    return;
            }
            DataTracker.Log("Finished indexing!");
        }
        
        public void IndexChannel(string channelId)
        {
            try
            {
                DataTracker.Log($"Indexing channel {channelId}");
                YouTubeService yt = new YouTubeService(new BaseClientService.Initializer() { ApiKey = _youtubeApiKey });
                ChannelsResource.ListRequest channelsListRequest = yt.Channels.List("contentDetails");
                channelsListRequest.Id = channelId;
                ChannelListResponse channelsListResponse = channelsListRequest.Execute();
                if (channelsListResponse.Items == null)
                    throw new Exception($"Could not fetch channel '{channelId}'");
                int consecutiveAlreadyIndexed = 0;
                int consecutiveErrorCount = 0;
                foreach (Google.Apis.YouTube.v3.Data.Channel channel in channelsListResponse.Items)
                {
                    string uploadsListId = channel.ContentDetails.RelatedPlaylists.Uploads;
                    string nextPageToken = "";
                    while (nextPageToken != null)
                    {
                        PlaylistItemsResource.ListRequest playlistItemsListRequest = yt.PlaylistItems.List("snippet");
                        playlistItemsListRequest.PlaylistId = uploadsListId;
                        playlistItemsListRequest.MaxResults = 50;
                        playlistItemsListRequest.PageToken = nextPageToken;
                        PlaylistItemListResponse playlistItemsListResponse = playlistItemsListRequest.Execute();
                        foreach (PlaylistItem playlistItem in playlistItemsListResponse.Items)
                        {
                            IndexResult indexResult = IndexVideo(channelId, playlistItem);
                            if (indexResult == IndexResult.WasAlreadyIndexed)
                            {
                                DataTracker.Log($"Already indexed video {playlistItem.Snippet.Title}");
                                consecutiveAlreadyIndexed++;
                                consecutiveErrorCount = 0;
                            }
                            else if (indexResult == IndexResult.WasNew)
                            {
                                DataTracker.Log($"Indexed video {playlistItem.Snippet.Title}");
                                consecutiveAlreadyIndexed = 0;
                                consecutiveErrorCount = 0;
                            }
                            else if (indexResult == IndexResult.Error)
                            {
                                consecutiveAlreadyIndexed = 0;
                                consecutiveErrorCount++;
                            }
                            if (consecutiveErrorCount >= CONSECUTIVE_ERROR_MAX)
                            {
                                _tooManyErrors = true;
                                DataTracker.Log($"Too many errors in a row, something's wrong. Bailing.");
                                return;
                            }
                            if (!_reindexAll && consecutiveAlreadyIndexed >= CONSECUTIVE_ALREADY_INDEXED_MAX)
                            {
                                DataTracker.Log($"Probably already indexed the rest of this channel, moving on");
                                return;
                            }
                        }
                        nextPageToken = playlistItemsListResponse.NextPageToken;
                    }
                }
            }
            catch (Exception e)
            {
                DataTracker.Log($"ERROR {e}");
            }
        }

        private IndexResult IndexVideo(string channelId, PlaylistItem playlistItem)
        {
            try
            {
                string videoId = playlistItem.Snippet.ResourceId.VideoId;
                if (!_reindexAll && ElasticManager.Instance.SearchForOneVideo(videoId) != null)
                    return IndexResult.WasAlreadyIndexed;

                using var youTubeTranscriptApi = new YouTubeTranscriptApi();
                List<TranscriptItem> transcriptParts = youTubeTranscriptApi.GetTranscript(videoId).ToList();
                var mapping = new SearchResultItemElasticMapping
                {
                    video_id = videoId,
                    channel_id = channelId,
                    channel_name = playlistItem.Snippet.ChannelTitle,
                    title = playlistItem.Snippet.Title,
                    url = $"https://www.youtube.com/watch?v={videoId}",
                    date = playlistItem.Snippet.PublishedAtDateTimeOffset.Value.DateTime,
                    description = playlistItem.Snippet.Description,
                    duration = transcriptParts.Last().Start + transcriptParts.Last().Duration,
                    transcript_full = string.Join(" ", transcriptParts.Select(x => x.Text)),
                    transcript_parts = transcriptParts.Select(x => new TranscriptPart
                        { duration = x.Duration, start = x.Start, text = x.Text }).ToList(),
                };

                ElasticManager.Instance.Index(mapping);
                return IndexResult.WasNew;
            }
            catch (Exception e)
            {
                Console.Write("ERROR: " + e);
                return IndexResult.Error;
            }
        }

        private enum IndexResult
        {
            WasNew,
            WasAlreadyIndexed,
            Error
        }
    }
}