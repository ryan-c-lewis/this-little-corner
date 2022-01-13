using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Primitives;
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
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    string response = new HomepageRequestHandler().GetResponse();
                    await context.Response.WriteAsync(response);
                });
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
            });
        }
    }
}