using System;
using System.IO;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Newtonsoft.Json.Linq;
using RestSharp;
using RestSharp.Authenticators.OAuth2;
using SearchServer.RequestHandlers;
using Channel = SearchServer.Model.Channel;

namespace SearchServer
{
    public class YoutubeManager
    {
        private const int CONSECUTIVE_ALREADY_INDEXED_MAX = 5;

        private readonly string _youtubeApiKey;
        private readonly string _youtubeOauthToken;

        public YoutubeManager()
        {
            _youtubeApiKey = new SecretsManager().GetSecret(SecretsManager.YOUTUBE_API_KEY);
            _youtubeOauthToken = GetOauthToken();
        }

        private string GetOauthToken()
        {
            string pathToServiceAccountKey = new SecretsManager().GetSecret(SecretsManager.YOUTUBE_SERVICE_ACCOUNT_SECRETS_FILE);
            using var stream = new FileStream(pathToServiceAccountKey, FileMode.Open, FileAccess.Read);
            GoogleCredential credential = GoogleCredential.FromStream(stream);
            credential = credential.CreateScoped("https://www.googleapis.com/auth/youtube.force-ssl");
            return credential.UnderlyingCredential.GetAccessTokenForRequestAsync().Result;
        }
        
        public void Index()
        {
            foreach (Channel channel in new ChannelsRequestHandler().GetChannels())
            {
                IndexChannel(channel.Id);
            }
        }
        
        public void IndexChannel(string channelId)
        {
            try
            {
                YouTubeService yt = new YouTubeService(new BaseClientService.Initializer() { ApiKey = _youtubeApiKey });
                ChannelsResource.ListRequest channelsListRequest = yt.Channels.List("contentDetails");
                channelsListRequest.Id = channelId;
                ChannelListResponse channelsListResponse = channelsListRequest.Execute();
                if (channelsListResponse.Items == null)
                    throw new Exception($"Could not fetch channel '{channelId}'");
                int consecutiveAlreadyIndexed = 0;
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
                                consecutiveAlreadyIndexed++;
                            else
                                consecutiveAlreadyIndexed = 0;
                            if (consecutiveAlreadyIndexed >= CONSECUTIVE_ALREADY_INDEXED_MAX)
                                return;
                        }
                        nextPageToken = playlistItemsListResponse.NextPageToken;
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("ERROR " + e);
            }
        }

        private IndexResult IndexVideo(string channelId, PlaylistItem playlistItem)
        {
            string videoId = playlistItem.Snippet.ResourceId.VideoId;
            // if (ElasticManager.Instance.SearchForOneVideo(videoId) != null)
            //     return IndexResult.WasAlreadyIndexed;

            RestResponse captionInfo = new RestClient("https://youtube.googleapis.com/youtube/v3/").ExecuteGet(new RestRequest($"captions?part=id&part=snippet&videoId={videoId}&key={_youtubeApiKey}"));
            JArray captionParts = JObject.Parse(captionInfo.Content)["items"] as JArray;
            if (captionParts.Count != 1)
                throw new NotImplementedException();
            string captionId = captionParts[0]["id"].ToString();
            //var transcript = youtubeClient.ExecuteGet(new RestRequest($"captions/{captionId}") {Authenticator = new OAuth2AuthorizationRequestHeaderAuthenticator(_youtubeOauthToken)});
            
            var transcript = new RestClient("http://gdata.youtube.com/feeds/api/").ExecuteGet(new RestRequest($"videos/{videoId}/captiondata/{captionId}") {Authenticator = new OAuth2AuthorizationRequestHeaderAuthenticator(_youtubeOauthToken)});
            //http://gdata.youtube.com/feeds/api/videos/[VIDEOID]/captiondata/[CAPTION TRACKID]
            
            // video_url = video['link'].split('&')[0]
            // video_seconds = convert_to_seconds(video['duration'])
            // more_details = get_video_details(youtube_api_key, video_id)
            // video_description = more_details['description']
            // video_date = more_details['publishedAt'].split('T')[0]
            // transcript_parts = get_transcript(video_id)
            // transcript_full_string = ' '.join([x['text'] for x in transcript_parts])
            //
            // to_index = {
            //     'video_id': video_id,
            //     'channel_id': channel_id,
            //     'channel_name': video['channel']['name'],
            //     'title': video_title,
            //     'url': video_url,
            //     'date': video_date,
            //     'description': video_description,
            //     'duration': video_seconds,
            //     'transcript_full': transcript_full_string,
            //     'transcript_parts': transcript_parts
            // }
            // to_index_json = json.dumps(to_index)
            //
            // store_record(elastic, video_id, to_index_json)
            
            Console.WriteLine("Video Title= {0}, Video ID ={1}", playlistItem.Snippet.Title, playlistItem.Snippet.ResourceId.VideoId);
            return IndexResult.WasAlreadyIndexed;
        }

        private enum IndexResult
        {
            WasNew,
            WasAlreadyIndexed,
            Error
        }
    }
}