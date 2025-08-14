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

function App() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Load bookings on page load
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
      alert("Failed to create booking (maybe overlap?)");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Booking Lists</h1>

      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.user} - {new Date(b.startTime).toLocaleString()} to{" "}
            {new Date(b.endTime).toLocaleString()}
          </li>
        ))}
      </ul>

      <h2>Create New Booking</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="User"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default App;

