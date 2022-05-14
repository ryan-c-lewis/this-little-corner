using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using SearchServer.Model;
using SearchServer.RequestHandlers;

namespace SearchTests
{
    [TestFixture]
    public class SearchResultTests
    {
        private void AssertNoDuplicateTranscriptParts(SearchResultItemElasticMapping mapping)
        {
            List<int> times = mapping.transcriptData.transcriptPartGroups.Select(x => (int)x.transcriptParts.First().start).ToList();
            Assert.AreEqual(times.Distinct().Count(), times.Count);
        }
        
        [Test]
        public void NoDuplicateTranscripts()
        {
            SearchResult results = new SearchRequestHandler()
                .GetResponse(new SearchRequest { Query = "test", PageSize = 10 });
            foreach (SearchResultItemElasticMapping result in results.items)
                AssertNoDuplicateTranscriptParts(result);
        }
        
        [Test]
        public void WithQuotes()
        {
            SearchResult results = new SearchRequestHandler()
                .GetResponse(new SearchRequest { Query = "kermit the frog", PageSize = 1 });
            Assert.Greater(results.totalResults, 20);
            Assert.Greater(results.items.First().transcriptData.transcriptPartGroups.Count, 0);
            AssertNoDuplicateTranscriptParts(results.items.First());
            
            results = new SearchRequestHandler()
                .GetResponse(new SearchRequest { Query = "\"kermit the frog\"", PageSize = 1 });
            Assert.Greater(results.totalResults, 0);
            Assert.Less(results.totalResults, 20);
            Assert.Greater(results.items.First().transcriptData.transcriptPartGroups.Count, 0);
            AssertNoDuplicateTranscriptParts(results.items.First());
        }
        
        [Test]
        public void CitiesHaveBodies()
        {
            SearchResult results = new SearchRequestHandler()
                .GetResponse(new SearchRequest { Query = "cities have bodies", PageSize = 1 });
            Assert.Greater(results.totalResults, 0);
            Assert.AreEqual("The Body of a City & How Authority Works", results.items.First().title);
            Assert.Greater(results.items.First().transcriptData.transcriptPartGroups.Count, 0);
            AssertNoDuplicateTranscriptParts(results.items.First());
        }
        
        [Test]
        public void SchoolSpirit()
        {
            SearchResult results = new SearchRequestHandler()
                .GetResponse(new SearchRequest { Query = "school spirit", PageSize = 1 });
            Assert.Greater(results.items.First().transcriptData.transcriptPartGroups.Count, 2);
            AssertNoDuplicateTranscriptParts(results.items.First());
        }
    }
}