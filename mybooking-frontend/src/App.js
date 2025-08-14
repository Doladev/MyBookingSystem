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
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Grid,
} from "@mui/material";

function App() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Load bookings from API
  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  // Handle booking creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBooking = { user, startTime, endTime };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    });

    if (res.status === 201) {
      const created = await res.json();
      setBookings([...bookings, created]);
      setUser("");
      setStartTime("");
      setEndTime("");
    } else {
      alert("Booking conflict or error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Booking System
      </Typography>

      {/* Booking List */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Current Bookings
        </Typography>
        <List>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <ListItem key={b.id} divider>
                <ListItemText
                  primary={`${b.user}`}
                  secondary={`${new Date(
                    b.startTime
                  ).toLocaleString()} → ${new Date(
                    b.endTime
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No bookings yet.
            </Typography>
          )}
        </List>
      </Paper>

      {/* Booking Form */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create a Booking
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="User Name"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start Time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Time"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            color="primary"
          >
            Create Booking
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;


