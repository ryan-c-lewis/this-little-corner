using System;

namespace SearchServer
{
    public class SecretsManager
    {
        public const string ELASTIC_URL = nameof(ELASTIC_URL);
        public const string ELASTIC_USERNAME = nameof(ELASTIC_USERNAME);
        public const string ELASTIC_PASSWORD = nameof(ELASTIC_PASSWORD);
        public const string ELASTIC_CERT = nameof(ELASTIC_CERT);
        public const string OPENAI_API_KEY = nameof(OPENAI_API_KEY);

        public string GetSecret(string name)
        {
            return Environment.GetEnvironmentVariable(name);
        }
    }
}