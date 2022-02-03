using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using SearchServer.Model;
using SearchServer.RequestHandlers;

namespace SearchServer
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            
            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin());
            
            app.ServeFiles();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/api/search", async context =>
                {
                    string query = context.Request.Query["q"];
                    string sort = context.Request.Query["sort"];
                    int.TryParse(context.Request.Query["page"], out int page);
                    int.TryParse(context.Request.Query["size"], out int size);
                    
                    var request = new SearchRequest {Query = query, Sort = sort, Page = page, PageSize = size};
                    var result = new SearchRequestHandler().GetResponse(request);
                    string jsonResult = JsonConvert.SerializeObject(result);
                    await context.Response.WriteAsync(jsonResult);
                });
                
                endpoints.MapGet("/api/transcript", async context =>
                {
                    string videoId = context.Request.Query["video_id"];
                    if (string.IsNullOrEmpty(videoId))
                        throw new Exception("video_id not set");
                    SearchResultItemElasticMapping result = new TranscriptRequestHandler().GetResponse(videoId);
                    string jsonResult = JsonConvert.SerializeObject(result);
                    await context.Response.WriteAsync(jsonResult);
                });
            });
        }
    }

    public static class StartupExtensions
    {
        internal static void ServeFiles(this IApplicationBuilder app, string path = "dist")
        {
            try
            {
                string staticFilesPath = Path.Join(Path.GetDirectoryName(typeof(Startup).Assembly.Location), path);
                var fileServerOptions = new FileServerOptions()
                {
                    EnableDefaultFiles = true,
                    EnableDirectoryBrowsing = false,
                    RequestPath = new PathString(string.Empty),
                    FileProvider = new PhysicalFileProvider(staticFilesPath)
                };

                fileServerOptions.StaticFileOptions.ServeUnknownFileTypes = true;

                app.UseFileServer(fileServerOptions);
            }
            catch (Exception)
            {
                Console.WriteLine("ERROR - Can't serve static files");
            }
        }
    }
}