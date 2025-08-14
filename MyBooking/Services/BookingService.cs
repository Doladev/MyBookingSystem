
using MyBooking.Dtos;
using MyBooking.Models;
using MyBooking.Repositories;

namespace MyBooking.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _repo;
        public BookingService(IBookingRepository repo) => _repo = repo;

        public async Task<BookingReadDto> CreateAsync(BookingCreateDto dto, CancellationToken ct = default)
        {
            if (dto.StartTime >= dto.EndTime)
                throw new ArgumentException("StartTime must be before EndTime");

            if (await _repo.AnyOverlapAsync(dto.StartTime, dto.EndTime, null, ct))
                throw new InvalidOperationException("Booking overlaps with an existing booking");

            var entity = new Booking
            {
                User = dto.User.Trim(),
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            var saved = await _repo.AddAsync(entity, ct);
            return Map(saved);
        }

        public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
            => await _repo.DeleteAsync(id, ct);

        public async Task<IReadOnlyList<BookingReadDto>> GetAllAsync(CancellationToken ct = default)
            => (await _repo.GetAllAsync(ct)).Select(Map).ToList();

        public async Task<BookingReadDto?> GetAsync(Guid id, CancellationToken ct = default)
        {
            var e = await _repo.GetAsync(id, ct);
            return e == null ? null : Map(e);
        }

        public async Task<bool> UpdateAsync(Guid id, BookingUpdateDto dto, CancellationToken ct = default)
        {
            if (dto.StartTime >= dto.EndTime)
                throw new ArgumentException("StartTime must be before EndTime");

            var existing = await _repo.GetAsync(id, ct);
            if (existing == null) return false;

            if (await _repo.AnyOverlapAsync(dto.StartTime, dto.EndTime, id, ct))
                throw new InvalidOperationException("Booking overlaps with an existing booking");

            existing.User = dto.User.Trim();
            existing.StartTime = dto.StartTime;
            existing.EndTime = dto.EndTime;

            return await _repo.UpdateAsync(existing, ct);
        }

        private static BookingReadDto Map(Booking b) => new BookingReadDto
        {
            Id = b.Id,
            User = b.User,
            StartTime = b.StartTime,
            EndTime = b.EndTime
        };
    }
}
