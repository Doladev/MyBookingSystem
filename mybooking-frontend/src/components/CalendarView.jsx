import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BookingForm from "./BookingForm";
import { useBookings } from "../hooks/useBookings";

export default function CalendarView() {
  const { bookings, addBooking, updateBooking, removeBooking } = useBookings();
  const [formVisible, setFormVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const formatForLocalInput = (isoString) => {
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const handleTimeSelect = (info) => {
    setSelectedBooking({
      id: null,
      user: "",
      startTime: formatForLocalInput(info.startStr),
      endTime: formatForLocalInput(info.endStr),
    });
    setFormVisible(true);
  };

  const handleEventClick = (clickInfo) => {
    const b = bookings.find((bk) => bk.id === clickInfo.event.id);
    if (b) {
      setSelectedBooking({
        ...b,
        startTime: formatForLocalInput(b.startTime),
        endTime: formatForLocalInput(b.endTime),
      });
      setFormVisible(true);
    }
  };

  const handleFormSubmit = async (data) => {
    if (data.id) {
      await updateBooking(data);
    } else {
      await addBooking(data);
    }
    setFormVisible(false);
  };

  return (
    <>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        events={bookings.map((b) => ({
          id: b.id,
          title: b.user,
          start: b.startTime,
          end: b.endTime,
        }))}
        select={handleTimeSelect}
        eventClick={handleEventClick}
      />

      {formVisible && (
        <>
          {/* Modal backdrop */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.3)",
              zIndex: 999,
            }}
            onClick={() => setFormVisible(false)}
          />

          {/* Modal content */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              minWidth: "300px",
            }}
          >
            <BookingForm
              initialData={selectedBooking || { id: null, user: "", startTime: "", endTime: "" }}
              onCancel={() => setFormVisible(false)}
              onSave={handleFormSubmit}
              onDelete={removeBooking}
            />
          </div>
        </>
      )}
    </>
  );
}
