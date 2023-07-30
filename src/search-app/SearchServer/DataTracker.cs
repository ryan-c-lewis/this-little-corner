using System;
using NUnit.Framework;

namespace SearchServer
{
    public static class DataTracker
    {
        public static void Log(string msg)
        {
            // TODO: send this to google analytics or whatever. for now I just want to see if/how people are using this
            string output = $"{DateTime.Now:s} - {msg}";
            Console.WriteLine(output);
            TestContext.Progress.WriteLine(output);
        }
    }
}