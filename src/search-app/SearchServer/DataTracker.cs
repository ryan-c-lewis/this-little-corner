using System;

namespace SearchServer
{
    public static class DataTracker
    {
        public static void Log(string msg)
        {
            // TODO: send this to google analytics or whatever. for now I just want to see if/how people are using this
            Console.WriteLine($"{DateTime.Now:s} - " + msg);
        }
    }
}