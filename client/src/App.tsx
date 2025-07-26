// App.tsx: Main React app component (updated to render LoginForm for auth integration, free open-source React).
import React from 'react';
import './App.css';  // Default styles 
import LoginForm from './LoginForm';  // Import the new form component 

function App() {
  return (
    <div className="App">  // Wrapper with Tailwind classes if needed (free styling).
      <header className="App-header">
        <h1>PSB Payroll Login</h1>  // Simple header (customize as needed).
        <LoginForm />  // Render the login form here (connects to backend via Axios, free).
      </header>
    </div>
  );
}

export default App;