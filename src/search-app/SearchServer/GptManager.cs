using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using OpenAI.GPT3;
using OpenAI.GPT3.Managers;
using OpenAI.GPT3.ObjectModels;
using OpenAI.GPT3.ObjectModels.RequestModels;
using OpenAI.GPT3.ObjectModels.ResponseModels;
using SearchServer.Model;

namespace SearchServer
{
    public class GptManager
    {
        private static DateTime TodayStartedOn = DateTime.Today;
        private static int RequestsToday = 0;
        private const int MAX_REQUESTS_PER_DAY = 300;
        
        private static object CallLock = new object();
        private static DateTime PreviousRequestTime = DateTime.MinValue;
        private static TimeSpan MinTimeBetweenCalls = TimeSpan.FromSeconds(2);

        private bool TooManyRequestsToday()
        {
            if (TodayStartedOn != DateTime.Today)
            {
                TodayStartedOn = DateTime.Today;
                RequestsToday = 0;
            }

            RequestsToday++;
            if (RequestsToday > MAX_REQUESTS_PER_DAY)
                return true;
            return false;
        }
        
        public string Summarize(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return "No transcript found";
            if (TooManyRequestsToday())
                return "Too many requests made today. If this doesn't seem right, ping Ryan on discord";

            var chunks = new List<string>();
            IEnumerable<string> words = input.Split(' ');
            int wordsPerChunk = 2000;
            while (words.Any())
            {
                IEnumerable<string> theseWords = words.Take(wordsPerChunk);
                chunks.Add(string.Join(" ", theseWords));
                words = words.Skip(wordsPerChunk);
            }

            var partialSummaries = new List<string>();
            foreach (string chunk in chunks)
            {
                string partialSummary = AskChatGpt("Summarize this text: " + chunk, 100);
                partialSummaries.Add(partialSummary);
            }
            
            string topicList = AskChatGpt("Summarize this text as a bullet list of topics: " + string.Join(" ", partialSummaries));
            return "Here is a summary of topics: " + topicList;
        }

        public string GenerateTimestamps(SearchResultItemElasticMapping mapping)
        {
            if (mapping.transcript_parts == null || !mapping.transcript_parts.Any())
                return "No transcript found";
            if (TooManyRequestsToday())
                return "Too many requests made today. If this doesn't seem right, ping Ryan on discord";

            var sb = new StringBuilder();
            
            double totalEnd = mapping.transcript_parts.Last().start;
            double chunkSeconds = 5 * 60;
            int maxTokens = 50;
            if (totalEnd > 2 * 60 * 60) // for super long videos, let's break it into fewer chunks
            {
                chunkSeconds = 15 * 60;
                maxTokens = 100;
            }
            double currentChunkStart = 0;
            double currentChunkEnd = currentChunkStart + chunkSeconds;
            while (currentChunkEnd < totalEnd)
            {
                try
                {
                    List<TranscriptPart> chunkParts = mapping.transcript_parts
                        .Where(x => x.start >= currentChunkStart && x.start <= currentChunkEnd).ToList();
                    string chunkString = string.Join(" ", chunkParts.Select(x => x.text));

                    string topic = AskChatGpt("Summarize the following in 10 words or less:\n\n" + chunkString, maxTokens);
                    string userFriendlyTimestamp = TimeSpan.FromSeconds(currentChunkStart).ToString(@"hh\:mm\:ss");
                    string toAppend = $"{userFriendlyTimestamp} - {topic}";
                    Console.WriteLine(toAppend);
                    sb.AppendLine(toAppend);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
                
                currentChunkStart = currentChunkEnd;
                currentChunkEnd = currentChunkStart + chunkSeconds;
            }

            return sb.ToString();
        }

        private static string AskChatGpt(string prompt, int? maxTokens = null)
        {
            lock (CallLock)
            {
                while (DateTime.Now < PreviousRequestTime + MinTimeBetweenCalls)
                    Thread.Sleep(PreviousRequestTime + MinTimeBetweenCalls - DateTime.Now);
                PreviousRequestTime = DateTime.Now;
                
                var openAiService = new OpenAIService(new OpenAiOptions { ApiKey =  new SecretsManager().GetSecret(SecretsManager.OPENAI_API_KEY) });
                ChatCompletionCreateResponse completionResult = openAiService.ChatCompletion.CreateCompletion(
                    new ChatCompletionCreateRequest
                    {
                        Messages = new List<ChatMessage>
                        {
                            ChatMessage.FromUser(prompt)
                        },
                        Model = Models.ChatGpt3_5Turbo,
                        MaxTokens = maxTokens
                    }).Result;
                if (completionResult.Successful)
                {
                    return completionResult.Choices.First().Message.Content.Trim();
                }

                DataTracker.Log("SUMMARIZE error: " + completionResult.Error);
                throw new Exception("ChatGPT error: " + completionResult.Error);
            }
        }
    }
}