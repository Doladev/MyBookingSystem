
using System.Net;
using System.Net.Http.Json;
using MyBooking.Dtos;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using MyBooking.Services;
using Microsoft.Extensions.DependencyInjection;

namespace MyBooking.Tests;

public class BookingApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public BookingApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        // _client = factory.CreateClient();

         var customizedFactory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove the existing IBookingService registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(IBookingService));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Register a *new instance per scope* (fresh list for each request)
                services.AddScoped<IBookingService, BookingService>();
            });
        });

        _client = customizedFactory.CreateClient();
    }

    [Theory]
    [InlineData("Tenzin")]
    [InlineData("Dorji")]
    [InlineData("Richard")]
    public async Task Post_ShouldCreateBooking(string userName)
    {
        // Arrange & Act
        var created = await CreateBookingAsync(userName);

        //Assert
        Assert.NotNull(created);
        Assert.Equal(userName, created.User);
        Assert.NotEqual(0, created.Id);
    }

    [Theory]
    [InlineData("Tenzin")]
    [InlineData("Richard")]
    public async Task GetById_ShouldReturnBooking(string userName)
    {
        // Arrange
        var created = await CreateBookingAsync(userName);

        // Act
        var getResponse = await _client.GetAsync($"/api/bookings/{created!.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        var booking = await getResponse.Content.ReadFromJsonAsync<BookingReadDto>();
        Assert.NotNull(booking);
        Assert.Equal(userName, booking!.User);
    }

    [Fact]
    public async Task Put_ShouldUpdate_WhenExists()
    {
        var dto = new BookingCreateDto
        {
            User = "Bob",
            StartTime = DateTime.UtcNow,
            EndTime = DateTime.UtcNow.AddHours(1)
        };

        var post = await _client.PostAsJsonAsync("/api/bookings", dto);
        var created = await post.Content.ReadFromJsonAsync<BookingReadDto>();

        var update = new BookingUpdateDto
        {
            User = "Bobby",
            StartTime = created!.StartTime,
            EndTime = created.EndTime.AddHours(1)
        };

        var put = await _client.PutAsJsonAsync($"/api/bookings/{created.Id}", update);
        Assert.Equal(HttpStatusCode.NoContent, put.StatusCode);
    }

    [Fact]
    public async Task Delete_ShouldRemove_WhenExists()
    {
        var dto = new BookingCreateDto
        {
            User = "ToDelete",
            StartTime = DateTime.UtcNow,
            EndTime = DateTime.UtcNow.AddHours(1)
        };

        var post = await _client.PostAsJsonAsync("/api/bookings", dto);
        var created = await post.Content.ReadFromJsonAsync<BookingReadDto>();

        var del = await _client.DeleteAsync($"/api/bookings/{created!.Id}");
        Assert.Equal(HttpStatusCode.NoContent, del.StatusCode);

        var get = await _client.GetAsync($"/api/bookings/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, get.StatusCode);
    }

    [Fact]
    public async Task Post_ShouldReject_InvalidTimes()
    {
        var dto = new BookingCreateDto
        {
            User = "Invalid",
            StartTime = DateTime.UtcNow.AddHours(2),
            EndTime = DateTime.UtcNow.AddHours(1)
        };
        var post = await _client.PostAsJsonAsync("/api/bookings", dto);
        Assert.Equal(HttpStatusCode.BadRequest, post.StatusCode);
    }

    [Fact]
    public async Task Post_ShouldConflict_OnOverlap()
    {
        var now = DateTime.UtcNow;
        var a = new BookingCreateDto { User = "A", StartTime = now, EndTime = now.AddHours(1) };
        var b = new BookingCreateDto { User = "B", StartTime = now.AddMinutes(30), EndTime = now.AddHours(2) };

        var postA = await _client.PostAsJsonAsync("/api/bookings", a);
        Assert.Equal(HttpStatusCode.Created, postA.StatusCode);

        var postB = await _client.PostAsJsonAsync("/api/bookings", b);
        Assert.Equal(HttpStatusCode.Conflict, postB.StatusCode);
    }

    //Helper methods
    private async Task<BookingReadDto> CreateBookingAsync(string userName)
    {
        var dto = new BookingCreateDto
        {
            User = userName,
            StartTime = DateTime.UtcNow,
            EndTime = DateTime.UtcNow.AddHours(1)
        };

        var response = await _client.PostAsJsonAsync("/api/bookings", dto);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var created = await response.Content.ReadFromJsonAsync<BookingReadDto>();
        Assert.NotNull(created);
        return created!;
    }

}
