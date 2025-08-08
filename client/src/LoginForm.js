// LoginForm.js: React component for login form (updated with onLoginSuccess prop for App state update – free open-source React).
import React from 'react';
import { useForm } from 'react-hook-form';  // Free form handling lib.
import axios from 'axios';  // Free for API calls.
import { jwtDecode } from 'jwt-decode';  // Free for decoding token.

function LoginForm({ onLoginSuccess }) {
  const { register, handleSubmit } = useForm();  // Hook for form state (free).

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/login', data);  // Call backend API (free).
      const token = response.data.token;  // Extract token from response.
      localStorage.setItem('token', token);  // Store JWT locally (free browser storage).
      console.log('Login successful');  // Log success (free).

      const decoded = jwtDecode(token);  // Decode token to get role (free).
      console.log('Role:', decoded.role);  // Log role for debugging (free).
      onLoginSuccess();  // Call prop to update App state (free, triggers dashboard render).
    } catch (error) {
      console.error('Login failed', error);  // Handle errors (free).
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white rounded shadow">  // Tailwind CSS (free styling).
      <input {...register('email')} placeholder="Email" className="mb-2 p-2 border text-black" />
      <input {...register('password')} type="password" placeholder="Password" className="mb-2 p-2 border text-black" />
      <button type="submit" className="bg-psb-blue text-white p-2">Login</button>  // Custom color from Tailwind config.
    </form>
  );
};

export default LoginForm;