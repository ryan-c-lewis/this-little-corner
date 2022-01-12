using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    string response = new HomepageRequestHandler().GetResponse();
                    await context.Response.WriteAsync(response);
                });
                endpoints.MapGet("/api/search/{query}", async context =>
                {
                    string query = context.GetRouteValue("query")?.ToString();
                    string response = new SearchRequestHandler(query).GetResponse();
                    await context.Response.WriteAsync(response);
                });
            });
        }
    }
}