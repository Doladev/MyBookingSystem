using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MyBooking.Repositories;

public class MyBookingFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove existing DbContext
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<BookingDbContext>));
            if (descriptor != null) services.Remove(descriptor);

            // Register DbContext with named in-memory db
            services.AddDbContext<BookingDbContext>(options =>
            {
                options.UseInMemoryDatabase("BookingsDb");
            });
        });
    }
}
