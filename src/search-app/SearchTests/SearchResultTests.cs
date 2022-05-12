using System.Linq;
using NUnit.Framework;
using SearchServer.Model;
using SearchServer.RequestHandlers;

namespace SearchTests
{
    [TestFixture]
    public class SearchResultTests
    {
        [Test]
        public void WithQuotes()
        {
            SearchResult results = new SearchRequestHandler()
                .GetResponse(new SearchRequest { Query = "kermit the frog", PageSize = 1 });
            Assert.Greater(results.totalResults, 20);
            Assert.Greater(results.items.First().transcriptData.transcriptPartGroups.Count, 0);
            
            results = new SearchRequestHandler()
                .GetResponse(new SearchRequest { Query = "\"kermit the frog\"", PageSize = 1 });
            Assert.Greater(results.totalResults, 0);
            Assert.Less(results.totalResults, 20);
            Assert.Greater(results.items.First().transcriptData.transcriptPartGroups.Count, 0);
        }
        
        [Test]
        public void CitiesHaveBodies()
        {
            SearchResult results = new SearchRequestHandler()
                .GetResponse(new SearchRequest { Query = "cities have bodies", PageSize = 1 });
            Assert.Greater(results.totalResults, 0);
            Assert.AreEqual("The Body of a City & How Authority Works", results.items.First().title);
            Assert.Greater(results.items.First().transcriptData.transcriptPartGroups.Count, 0);
        }
        
        [Test]
        public void SchoolSpirit()
        {
            SearchResult results = new SearchRequestHandler()
                .GetResponse(new SearchRequest { Query = "school spirit", PageSize = 1 });
            Assert.Greater(results.items.First().transcriptData.transcriptPartGroups.Count, 2);
        }
    }
}