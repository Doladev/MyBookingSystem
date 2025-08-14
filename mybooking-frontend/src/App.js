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

import React from "react";
import CalendarView from "./components/CalendarView";
import { BookingsProvider } from "./hooks/useBookings";

export default function App() {
  return (
    <BookingsProvider>
      <main style={{ padding: "20px" }}>
        <h1>Workspace Booking System</h1>
        <CalendarView />
      </main>
    </BookingsProvider>
  );
}





