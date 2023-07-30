using Microsoft.AspNetCore.Hosting;

namespace SearchServer
{
    public class Program
    {
        static void Main(string[] args)
        {
            //YoutubeManager.IndexEveryHour();
            
            IWebHost host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls("http://*:80")
                .UseStartup<Startup>()
                .Build();
            host.Run();
        }
    }
}