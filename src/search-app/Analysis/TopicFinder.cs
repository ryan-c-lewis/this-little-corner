using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;

namespace Analysis
{
    public class TopicFinder
    {
        private readonly Dictionary<string, int> englishWordCommonality;
        private readonly ISet<string> uselessWords = new HashSet<string>
        {
            "podcast", "a.m", "p.m", "a.m.", "p.m.", "ya", "__", "[", "]", "[music]", "[laughter]", "[applause]", "you'd", "okay", "ha", "bla", "wow", "boom", "wasn't", "couldn't", "shouldn't", "isn't", "they'd", "it'll", "we'd", "wouldn't", "aren't", "gonna", "whoa", "you'll", "won't", "cetera", "today's", "haven't", "through", "throughout", "verse", "didn't", "blah", "yada", "um", "uh", "yeah", "yadda", "doesn't", "there's", "i'm", "it's", "we're", "we'll", "he's", "she's", "you're", "i've", "let's", "they're", "i'll", "what's", "where's", "we've", "he'll", "she'll", "yep", "can't", "i'd", "that's", "they'll", "you've", "they've", "here's", "who's", "don't"
        };
        private static readonly ISet<string> junkyStartingWords = new HashSet<string>
        {
            "put", "pull", "see", "says", "saying", "said", "someone", "something", "somewhere", "such", "watching", "preposition", "prepositional", "more", "most", "much", "accept", "devote", "dig", "deeply", "deeper", "definitely", "cultivate", "completely", "exist", "explain", "listening", "let", "literally", "lot", "make", "makes", "many", "understand", "way", "want", "wait", "woods", "years", "only", "once", "obviously", "mean", "hello", "hey", "however", "guy", "happening", "happens", "having", "give", "goes", "got", "gotten", "greatly", "friends", "every", "exact", "exactly", "explore", "different", "doing", "come", "certain", "cannot", "both", "becoming", "any", "anything", "asking", "always", "were", "which", "whatever", "whether", "use", "still", "talks", "telling", "take", "their", "thanks", "no", "say", "same", "sides", "guess", "falling", "falls", "fell", "get", "go", "everybody", "ask", "basically", "brings", "also", "absolutely", "actually", "just", "did", "does", "even", "far", "figure", "figured", "had", "hasn't", "again", "anybody", "been", "bit", "choices", "talked", "talking", "tell", "tells", "tend", "thing", "things", "too", "some", "somebody", "weekday", "weren't", "whole", "whoever", "why", "wonders", "bye", "yeah", "okay", "our", "your", "really", "my", "me", "ago", "his", "either", "well", "-", "for", "&", "by", "to", "oh", "i", "a", "and", "of", "in", "on", "that", "read", "a", "abaft", "aboard", "about", "across", "against", "along", "alongside", "amid", "amidst", "among", "amongst", "an", "anenst", "apropos", "apud", "around", "as", "aside", "astride", "at", "athwart", "atop", "barring", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by", "circa", "concerning", "despite", "down", "during", "except", "excluding", "failing", "following", "for", "forenenst", "from", "given", "in", "including", "inside", "into", "lest", "like", "mid", "midst", "minus", "modulo", "near", "next", "notwithstanding", "of", "off", "on", "onto", "opposite", "out", "outside", "over", "pace", "past", "per", "plus", "pro", "qua", "regarding", "round", "sans", "save", "since", "than", "through", "throughout", "till", "times", "to", "toward", "towards", "under", "underneath", "unlike", "until", "unto", "up", "upon", "versus", "via", "vice", "with", "within", "without", "worth", "about", "all", "are", "as", "at", "be", "because", "but", "can", "could", "do", "each", "going", "has", "have", "he", "how", "if", "is", "it", "know", "like", "little", "might", "not", "one", "or", "other", "people", "right", "should", "so", "thank", "the", "then", "there", "these", "they", "think", "this", "those", "very", "was", "we", "what", "when", "where", "who", "will", "with", "would", "you"
        };
        private static readonly ISet<string> junkyEndingWords = new HashSet<string>
        {
            "tries", "why", "some", "says", "you", "what", "thanks", "minutes", "years", "are", "now", "thing", "bye", "yeah", "okay", "where", "which", "because", "increasingly", "all", "did", "has", "if", "my", "said", "was", "me", "ago", "plays", "thinks", "talked", "that", "we", "so", "-", "&", "for", "oh", "be", "it", "with", "that", "to", "concludes", "writes", "isn't", "or", "my", "and", "a", "i", "is", "of", "in", "the", "as", "once", "a", "abaft", "aboard", "about", "above", "absent", "across", "afore", "after", "against", "along", "alongside", "amid", "amidst", "among", "amongst", "an", "anenst", "apropos", "apud", "around", "as", "aside", "astride", "at", "athwart", "atop", "barring", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by", "circa", "concerning", "despite", "down", "during", "except", "excluding", "failing", "following", "for", "forenenst", "from", "given", "in", "including", "inside", "into", "lest", "like", "mid", "midst", "minus", "modulo", "near", "next", "notwithstanding", "of", "off", "on", "onto", "opposite", "out", "outside", "over", "pace", "past", "per", "plus", "pro", "qua", "regarding", "round", "sans", "save", "since", "than", "through", "throughout", "till", "times", "to", "toward", "towards", "under", "underneath", "unlike", "until", "unto", "up", "upon", "versus", "via", "vice", "with", "within", "without", "worth"
        };
        private static readonly ISet<string> junkyPhraseStartings = new HashSet<string>
        {
            "youtube", "close with", "welcome to", "group of", "getting flipped", "first time", "friend of mine", "end of the day", "depends on", "bunch of", "closer and closer", "bigger and bigger", "being able", "able to", "agree with", "worse and worse", "use the", "want to", "wanted to", "way of", "kind of", "lot of", "sort of", "trying to"
        };
        private static readonly ISet<string> junkyPhraseEndings = new HashSet<string>
        {
            "youtube algorithm", "and thy", "the preposition", "about how", "about this", "about when", "masculine singular", "masculine plural", "feminine singular", "feminine plural", "der clay", "der klay", "as far", "my name", "to do", "and then", "really", "a lot", "that are", "to have", "to your", "on your", "at this", "and we", "in keeping", "of us", "with your", "i was", "to my", "and my"
        };
        private static readonly ISet<string> phrasesToIgnore = new HashSet<string>
        {
            "quite a bit", "relevance realization because relevance realization", "two sides", "two things", "point of view", "awakening from the meaning", "awakening from the meeting crisis", "vast majority", "best way"
        };
        
        
        public TopicFinder()
        {
            englishWordCommonality = new Dictionary<string, int>();
            List<string> englishWords = File
                .ReadAllText(Path.Join(Directory.GetCurrentDirectory(),
                    "../../google-10000-english-usa.txt"))
                .Split("\n").Take(3000).ToList();
            for (int n = 0; n < englishWords.Count; n++)
                englishWordCommonality[englishWords[n]] = n;

        }
        public void Find()
        {
            string directoryPath = Path.Join(Directory.GetCurrentDirectory(), "../../../../../data/video_metadata");
            foreach (string directory in Directory.EnumerateDirectories(directoryPath, "*.*"))
            {
                string channelId = directory.Split('\\', '/').Last();
                string outputFile = Path.Join(Directory.GetCurrentDirectory(), $"channel_topics/{channelId}.txt");
                if (File.Exists(outputFile))
                    continue;
                ParseChannel(directory, outputFile);
            }

            long totalWordCount = 0;
            Dictionary<string, long> wordCounts = new Dictionary<string, long>();
            string intermediateDir = Path.Join(Directory.GetCurrentDirectory(), "channel_topics");
            foreach (string fileName in Directory.EnumerateFiles(intermediateDir, "*.*"))
            {
                List<string> lines = File.ReadAllText(fileName).Split('\n').ToList();
                int wordCount = int.Parse(lines[0]);
                totalWordCount += wordCount;
                foreach (string line in lines.Skip(1))
                {
                    string cleanLine = line.Replace("\r", "").Replace("\n", "");
                    if (string.IsNullOrEmpty(cleanLine))
                        continue;
                    int splitter = cleanLine.IndexOf(',');
                    if (splitter == -1)
                        continue;
                    if (!int.TryParse(cleanLine.Substring(0, splitter), out int count))
                        continue;
                    string phrase = cleanLine.Substring(splitter + 1);
                    if (wordCounts.ContainsKey(phrase))
                        wordCounts[phrase] += count;
                    else
                        wordCounts[phrase] = count;
                }
            }

            Console.WriteLine("Printing out results");
            StringBuilder sb = new StringBuilder();
            foreach (KeyValuePair<string, long> phrase in wordCounts
                .Where(x => x.Value >= 3)
                .Where(x => !IsDefinitelyJunk(x.Key))
                .OrderByDescending(x => EstimateMeaningfulness(x.Key, x.Value, totalWordCount))
                .Take(1000)
                .OrderBy(x => x.Key))
            {
                sb.AppendLine($"{phrase.Key}");
            }
            File.WriteAllText("out.txt", sb.ToString());
        }

        private double GetFrequencyScore(long phraseValue, long totalWordCount)
        {
            return Math.Pow((double) phraseValue / totalWordCount, 0.1);
        }
        
        private double GetUniquenessScore(string phrase)
        {
            int commonalityScore = 0;
            List<string> wordsInPhrase = phrase.Split(" ").ToList();
            foreach (string word in wordsInPhrase)
            {
                int score = englishWordCommonality.ContainsKey(word) ? englishWordCommonality[word] : 10000;
                commonalityScore += score;
            }
            double averageWordRanking = (double)commonalityScore / wordsInPhrase.Count;
            return averageWordRanking / 10000;
        }

        private double GetLongnessScore(string phrase)
        {
            int numberOfWords = phrase.Split(" ").Length;
            return (double) numberOfWords / 5;
        }

        private double EstimateMeaningfulness(string phrase, long uses, long totalWordCount)
        {
            double frequencyScore = GetFrequencyScore(uses, totalWordCount); // jordan peterson ~ 6, one-time phrases ~ 1
            double uniquenessScore = GetUniquenessScore(phrase);
            double longnessScore = GetLongnessScore(phrase);
            
            return
                frequencyScore * 1
                + uniquenessScore * 0.1
                + longnessScore * 0.1;
        }

        private void ParseChannel(string directory, string outputFile)
        {
            var metadatas = new ConcurrentBag<JObject>();
            var phraseCounts = new Dictionary<string, int>();
            string channelId = directory.Split('\\', '/').Last();
            Console.WriteLine("Parsing channel " + channelId);
            int filesProcessed = 0;
            int totalWordCount = 0;
            List<string> fileNames = Directory.EnumerateFiles(directory, "*.*", SearchOption.AllDirectories).ToList();
            foreach (string file in fileNames)
            {
                filesProcessed++;
                if (filesProcessed % 10 == 0)
                    Console.WriteLine(filesProcessed + " of " + fileNames.Count);

                List<string> wordsInFile = new List<string>();
                JObject metadata = JObject.Parse(File.ReadAllText(file));
                metadatas.Add(metadata);
                foreach (JObject transcriptPart in metadata["transcript_parts"])
                {
                    string text = transcriptPart["text"].ToString().ToLower();
                    wordsInFile.AddRange(text.Replace("\n", "").Replace("\r", "").Split(" "));
                }

                totalWordCount += wordsInFile.Count;

                for (int n = 2; n <= 5; n++)
                {
                    for (int index = 0; index <= wordsInFile.Count - n; index++)
                    {
                        List<string> wordsInPhrase = wordsInFile.Skip(index).Take(n).ToList();
                        string phrase = string.Join(" ", wordsInPhrase).Replace("“", "").Replace(",", "").Replace("\r", "").Replace("\n", "");
                        if (wordsInPhrase.Any(x => uselessWords.Contains(x)))
                            continue;
                        if (IsDefinitelyJunk(phrase, wordsInPhrase))
                            continue;
                        
                        if (phraseCounts.ContainsKey(phrase))
                            phraseCounts[phrase]++;
                        else
                            phraseCounts[phrase] = 1;
                    }
                }
            }
            
            Console.WriteLine("Writing to file...");
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(totalWordCount.ToString());
            foreach (KeyValuePair<string, int> phraseCount in phraseCounts)
            {
                sb.AppendLine(phraseCount.Value + "," + phraseCount.Key);
            }
            File.WriteAllText(outputFile, sb.ToString());
        }

        private bool IsDefinitelyJunk(string phrase, List<string> wordsInPhrase = null)
        {
            if (string.IsNullOrWhiteSpace(phrase))
                return true;
            
            wordsInPhrase = wordsInPhrase ?? phrase.Split(' ').ToList();

            if (wordsInPhrase.All(x => int.TryParse(x, out _)))
                return true;
            if (wordsInPhrase.Count(x => int.TryParse(x, out _)) > 1)
                return true;
            if (junkyStartingWords.Contains(wordsInPhrase.First()))
                return true;
            if (junkyEndingWords.Contains(wordsInPhrase.Last()))
                return true;
            if (junkyPhraseStartings.Any(phrase.StartsWith))
                return true;
            if (junkyPhraseEndings.Any(phrase.EndsWith))
                return true;
            if (phrasesToIgnore.Any(x => x == phrase))
                return true;
            if (wordsInPhrase.Count == 2 && wordsInPhrase[0] == wordsInPhrase[1])
                return true;
            if (wordsInPhrase.Any(x => uselessWords.Contains(x)))
                return true;
            return false;
        }
    }
}