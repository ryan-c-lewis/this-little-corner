using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace SearchServer
{
    public class Program
    {
        static void Main(string[] args)
        {
            // It would be nice to have the site auto-index, but AWS flags this traffic as a robot/spam and it doesn't work
            // So unless I can find a solution to that, I just have to run this from my own machine :(
            Task.Run(() =>
            {
                if (Environment.MachineName == "DESKTOP-SPEU90N")
                    YoutubeManager.IndexEveryHour();
            });
            
            IWebHost host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls("http://*:80")
                .UseStartup<Startup>()
                .Build();
            host.Run();
        }
    }
}