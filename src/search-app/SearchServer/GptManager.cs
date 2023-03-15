using System;
using System.Collections.Generic;
using System.Linq;
using OpenAI.GPT3;
using OpenAI.GPT3.Managers;
using OpenAI.GPT3.ObjectModels;
using OpenAI.GPT3.ObjectModels.RequestModels;
using OpenAI.GPT3.ObjectModels.ResponseModels;

namespace SearchServer
{
    public class GptManager
    {
        private const string API_KEY = "..."; // todo probably time to actually start doing big boy secret handling
        
        private static DateTime TodayStartedOn = DateTime.Today;
        private static int RequestsToday = 0;
        private const int MAX_REQUESTS_PER_DAY = 300;

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

        private static string AskChatGpt(string prompt, int? maxTokens = null)
        {
            var openAiService = new OpenAIService(new OpenAiOptions { ApiKey =  API_KEY });
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
                return completionResult.Choices.First().Message.Content;
            }

            DataTracker.Log("SUMMARIZE error: " + completionResult.Error);
            throw new Exception("ChatGPT error: " + completionResult.Error);
        }
    }
}