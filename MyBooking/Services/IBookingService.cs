
using MyBooking.Dtos;

namespace MyBooking.Services
{
    public interface IBookingService
    {
        Task<BookingReadDto> CreateAsync(BookingCreateDto dto, CancellationToken ct = default);
        Task<BookingReadDto?> GetAsync(Guid id, CancellationToken ct = default);
        Task<IReadOnlyList<BookingReadDto>> GetAllAsync(CancellationToken ct = default);
        Task<bool> UpdateAsync(Guid id, BookingUpdateDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
    }
}
