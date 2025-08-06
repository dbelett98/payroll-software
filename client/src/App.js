// App.js: Main React app component (updated to conditionally render Dashboard after login – free open-source React).
import React, { useState } from 'react';
import './App.css';  // Default styles (free).
import LoginForm from './LoginForm';  // Import login (free).
import Dashboard from './Dashboard';  // Import dashboard (free).

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));  // Check for token on load (free state hook).

  return (
    <div className="App">
      <header className="App-header">
        <h1>PSB Payroll</h1>
        {isLoggedIn ? <Dashboard /> : <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />}  // Conditional render (free, passes callback to LoginForm).
      </header>
    </div>
  );
}

export default App;