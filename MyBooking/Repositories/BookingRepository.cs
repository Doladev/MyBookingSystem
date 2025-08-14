using Microsoft.EntityFrameworkCore;
using MyBooking.Models;

namespace MyBooking.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly BookingDbContext _context;

        public BookingRepository(BookingDbContext context)
        {
            _context = context;
        }

        public async Task<Booking> AddAsync(Booking booking, CancellationToken ct = default)
        {
            booking.Id = Guid.NewGuid();
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync(ct);
            return booking;
        }

        public async Task<bool> AnyOverlapAsync(DateTime start, DateTime end, Guid? excludeId = null, CancellationToken ct = default)
        {
            return await _context.Bookings
                .AnyAsync(b =>
                    (excludeId == null || b.Id != excludeId) &&
                    start < b.EndTime && end > b.StartTime,
                    ct);
        }

        public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(x => x.Id == id, ct);
            if (booking == null) return false;

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<IReadOnlyList<Booking>> GetAllAsync(CancellationToken ct = default)
        {
            return await _context.Bookings.AsNoTracking().ToListAsync(ct);
        }

        public async Task<Booking?> GetAsync(Guid id, CancellationToken ct = default)
        {
            return await _context.Bookings.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public async Task<bool> UpdateAsync(Booking booking, CancellationToken ct = default)
        {
            var existing = await _context.Bookings.FirstOrDefaultAsync(x => x.Id == booking.Id, ct);
            if (existing == null) return false;

            existing.StartTime = booking.StartTime;
            existing.EndTime = booking.EndTime;
            existing.User = booking.User;

            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}
