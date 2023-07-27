using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using SearchServer;
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
        public void QueryParts()
        {
            List<ElasticManager.QueryPart> parts = ElasticManager.GetParts("one").ToList();
            Assert.AreEqual(1, parts.Count);
            Assert.AreEqual(null, parts[0].Field);
            Assert.AreEqual("one", parts[0].Query);
            Assert.IsFalse(parts[0].Exact);
            
            parts = ElasticManager.GetParts("not exact").ToList();
            Assert.AreEqual(1, parts.Count);
            Assert.AreEqual(null, parts[0].Field);
            Assert.AreEqual("not exact", parts[0].Query);
            Assert.IsFalse(parts[0].Exact);
            
            parts = ElasticManager.GetParts("not exact \"is exact\"").ToList();
            Assert.AreEqual(2, parts.Count);
            Assert.AreEqual(null, parts[0].Field);
            Assert.AreEqual("not exact", parts[0].Query);
            Assert.IsFalse(parts[0].Exact);
            Assert.AreEqual(null, parts[1].Field);
            Assert.AreEqual("is exact", parts[1].Query);
            Assert.IsTrue(parts[1].Exact);
            
            parts = ElasticManager.GetParts(" not exact \"is exact\" also not exact ").ToList();
            Assert.AreEqual(3, parts.Count);
            Assert.AreEqual(null, parts[0].Field);
            Assert.AreEqual("not exact", parts[0].Query);
            Assert.IsFalse(parts[0].Exact);
            Assert.AreEqual(null, parts[1].Field);
            Assert.AreEqual("is exact", parts[1].Query);
            Assert.IsTrue(parts[1].Exact);
            Assert.AreEqual(null, parts[2].Field);
            Assert.AreEqual("also not exact", parts[2].Query);
            Assert.IsFalse(parts[2].Exact);
            
            parts = ElasticManager.GetParts("title(not exact)").ToList();
            Assert.AreEqual(1, parts.Count);
            Assert.AreEqual("title", parts[0].Field);
            Assert.AreEqual("not exact", parts[0].Query);
            Assert.IsFalse(parts[0].Exact);
            
            parts = ElasticManager.GetParts("title( not exact \"is exact\" ) other stuff").ToList();
            Assert.AreEqual(3, parts.Count);
            Assert.AreEqual("title", parts[0].Field);
            Assert.AreEqual("not exact", parts[0].Query);
            Assert.IsFalse(parts[0].Exact);
            Assert.AreEqual("title", parts[1].Field);
            Assert.AreEqual("is exact", parts[1].Query);
            Assert.IsTrue(parts[1].Exact);
            Assert.AreEqual(null, parts[2].Field);
            Assert.AreEqual("other stuff", parts[2].Query);
            Assert.IsFalse(parts[2].Exact);
            
            parts = ElasticManager.GetParts("description(my little pony) other stuff title(\"is exact\" )").ToList();
            Assert.AreEqual(3, parts.Count);
            Assert.AreEqual("description", parts[0].Field);
            Assert.AreEqual("my little pony", parts[0].Query);
            Assert.IsFalse(parts[0].Exact);
            Assert.AreEqual(null, parts[1].Field);
            Assert.AreEqual("other stuff", parts[1].Query);
            Assert.IsFalse(parts[1].Exact);
            Assert.AreEqual("title", parts[2].Field);
            Assert.AreEqual("is exact", parts[2].Query);
            Assert.IsTrue(parts[2].Exact);
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