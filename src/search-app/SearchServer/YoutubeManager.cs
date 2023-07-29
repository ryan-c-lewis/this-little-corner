using SearchServer.Model;
using SearchServer.RequestHandlers;

namespace SearchServer
{
    public class YoutubeManager
    {
        public void Index()
        {
            foreach (Channel channel in new ChannelsRequestHandler().GetChannels())
            {
                
            }
        }
    }
}