using Microsoft.AspNetCore.Hosting;

namespace SearchServer
{
    public class Program
    {
        static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls("http://*:51407")
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }
    }
}