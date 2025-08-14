
using System.ComponentModel.DataAnnotations;

namespace MyBooking.Dtos
{
    public class BookingCreateDto
    {
        [Required]
        [MinLength(1)]
        public string User { get; set; } = string.Empty;

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }

    public class BookingUpdateDto : BookingCreateDto { }

    public class BookingReadDto
    {
        public Guid Id { get; set; }
        public string User { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
