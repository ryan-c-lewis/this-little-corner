using NUnit.Framework;
using SearchServer;

namespace SearchTests
{
    [TestFixture]
    public class YoutubeManagerTests
    {
        [Test]
        public void RunIndexer()
        {
            new YoutubeManager().Index();
        }
    }
}