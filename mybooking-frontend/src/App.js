import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Container,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";

export default function App() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Load bookings
  const loadBookings = () => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((b) => ({
          id: b.id,
          title: b.user,
          start: b.startTime,
          end: b.endTime
        }));
        setEvents(mapped);
      })
      .catch((err) => console.error("Error loading bookings", err));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDateSelect = (selectInfo) => {
    setSelectedEvent(null);
    setStartTime(selectInfo.startStr);
    setEndTime(selectInfo.endStr);
    setUser("");
    setOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setStartTime(clickInfo.event.startStr);
    setEndTime(clickInfo.event.endStr);
    setUser(clickInfo.event.title);
    setOpen(true);
  };

  const handleSubmit = async () => {
    const bookingData = { user, startTime, endTime };

    if (selectedEvent) {
      // UPDATE booking
      const res = await fetch(`/api/bookings/${selectedEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (res.ok) {
        loadBookings();
        setOpen(false);
      } else {
        alert("Update failed");
      }
    } else {
      // CREATE booking
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (res.status === 201) {
        loadBookings();
        setOpen(false);
      } else {
        alert("Conflict or booking error");
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    if (window.confirm("Delete this booking?")) {
      const res = await fetch(`/api/bookings/${selectedEvent.id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        loadBookings();
        setOpen(false);
      } else {
        alert("Delete failed");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Booking Calendar
      </Typography>
      <Paper sx={{ p: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable={true}
          editable={true}
          events={events}
          select={handleDateSelect}
          eventClick={(info) => handleEventClick(info)}
          height="80vh"
        />
      </Paper>

      {/* Dialog for create/update */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {selectedEvent ? "Edit Booking" : "Create Booking"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="User Name"
              fullWidth
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedEvent && (
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          )}
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}




