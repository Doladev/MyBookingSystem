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
  const [user, setUser] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Load bookings from API
  useEffect(() => {
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
  }, []);

  const handleDateSelect = (selectInfo) => {
    setStartTime(selectInfo.startStr);
    setEndTime(selectInfo.endStr);
    setOpen(true);
  };

  const handleSubmit = async () => {
    const newBooking = { user, startTime, endTime };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking)
    });

    if (res.status === 201) {
      const created = await res.json();
      setEvents([
        ...events,
        {
          id: created.id,
          title: created.user,
          start: created.startTime,
          end: created.endTime
        }
      ]);
      setOpen(false);
      setUser("");
    } else {
      alert("Conflict or booking error");
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
          events={events}
          select={handleDateSelect}
          height="80vh"
        />
      </Paper>

      {/* Dialog for creating booking */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Booking</DialogTitle>
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}



