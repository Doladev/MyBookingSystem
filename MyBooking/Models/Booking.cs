
namespace MyBooking.Models
{
    public class Booking
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string User { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
