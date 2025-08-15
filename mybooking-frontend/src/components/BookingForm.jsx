import React, { useState, useEffect } from "react";

export default function BookingForm({ initialData, onSave, onCancel, onDelete }) {
  const [booking, setBooking] = useState(initialData);

  useEffect(() => {
    setBooking(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(booking);
  };

  const handleDelete = () => {
    if (booking.id) {
      onDelete(booking.id);
      onCancel(); // close the modal after delete
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>User:</label>
        <input
          type="text"
          name="user"
          value={booking.user}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Start Time:</label>
        <input
          type="datetime-local"
          name="startTime"
          value={booking.startTime}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>End Time:</label>
        <input
          type="datetime-local"
          name="endTime"
          value={booking.endTime}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
        {booking.id && (
          <button type="button" onClick={handleDelete} style={{ color: "red" }}>
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
