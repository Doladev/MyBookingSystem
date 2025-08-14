import React, { createContext, useContext, useEffect, useState } from "react";

const BookingsContext = createContext();

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then(setBookings);
  }, []);

  const addBooking = async (newBooking) => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    });
    if (res.ok) {
      const saved = await res.json();
      setBookings((prev) => [...prev, saved]);
    }
  };

  const updateBooking = async (booking) => {
    const res = await fetch(`/api/bookings/${booking.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? booking : b))
      );
    }
  };

  const removeBooking = async (id) => {
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <BookingsContext.Provider
      value={{ bookings, addBooking, updateBooking, removeBooking }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  return useContext(BookingsContext);
}
