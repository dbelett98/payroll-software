// App.js: Main React app component (renders Dashboard after login – free open-source React).
import React, { useState } from 'react';
import './App.css';  // Default styles.
import LoginForm from './LoginForm';  // Import login.
import Dashboard from './Dashboard';  // Import dashboard.

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));  // Check for token on load.

  return (
    <div className="App">
      <header className="App-header">
        <h1>PSB Payroll</h1>
        {isLoggedIn ? <Dashboard /> : <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />}  // Conditional rendering.
      </header>
    </div>
  );
}

export default App;