
using MyBooking.Models;

namespace MyBooking.Repositories
{
    public interface IBookingRepository
    {
        Task<Booking> AddAsync(Booking booking, CancellationToken ct = default);
        Task<Booking?> GetAsync(Guid id, CancellationToken ct = default);
        Task<IReadOnlyList<Booking>> GetAllAsync(CancellationToken ct = default);
        Task<bool> UpdateAsync(Booking booking, CancellationToken ct = default);
        Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
        Task<bool> AnyOverlapAsync(DateTime start, DateTime end, Guid? excludeId = null, CancellationToken ct = default);
    }
}
