
using MyBooking.Dtos;
using MyBooking.Models;
using MyBooking.Repositories;
using MyBooking.Services;
using Moq;
using Xunit;

namespace MyBooking.Tests;

public class BookingServiceUnitTests
{
    private readonly Mock<IBookingRepository> _repo = new();

    [Fact]
    public async Task CreateAsync_Throws_OnOverlap()
    {
        //Arrange
        _repo.Setup(r => r.AnyOverlapAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>(), null, default))
             .ReturnsAsync(true);
        var svc = new BookingService(_repo.Object);
        var dto = new BookingCreateDto { User = "X", StartTime = DateTime.UtcNow, EndTime = DateTime.UtcNow.AddHours(1) };

        //Act
        var result = svc.CreateAsync(dto);

        //Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => result);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsFalse_WhenMissing()
    {
        //Arrange
        _repo.Setup(r => r.GetAsync(42, default)).ReturnsAsync((Booking?)null);
        var svc = new BookingService(_repo.Object);
        var dto = new BookingUpdateDto { User = "Y", StartTime = DateTime.UtcNow, EndTime = DateTime.UtcNow.AddHours(1) };

        //Act
        var ok = await svc.UpdateAsync(42, dto);

        //Assert
        Assert.False(ok);
    }
}
