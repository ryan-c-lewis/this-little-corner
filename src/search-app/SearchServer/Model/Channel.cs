using System.Collections.Generic;
using System.Linq;

namespace SearchServer.Model
{
    public class Channel
    {
        public string Id { get; }
        public string Name { get; }
        public List<string> SearchNames { get; }

        public Channel(string id, string name, string[] searchNames)
        {
            Id = id;
            Name = name;
            SearchNames = searchNames.ToList();
        }
    }
}