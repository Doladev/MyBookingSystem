using Microsoft.EntityFrameworkCore;
using MyBooking.Models;

namespace MyBooking.Repositories
{
    public class BookingDbContext : DbContext
    {
        public BookingDbContext(DbContextOptions<BookingDbContext> options)
            : base(options) { }

        public DbSet<Booking> Bookings { get; set; }
    }
}
