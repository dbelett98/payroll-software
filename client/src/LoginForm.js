// LoginForm.tsx: React component for login form (updated for role check after login – free open-source React/jwt-decode).
import React from 'react';
import { useForm } from 'react-hook-form';  // Free form handling lib.
import axios from 'axios';  // Free for API calls.
import { jwtDecode } from 'jwt-decode';  // Free for decoding token.

interface LoginData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginData>();  // Hook for form state (free).

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await axios.post('http://localhost:3000/login', data);  // Call backend API (free).
      const token = response.data.token;  // Extract token from response.
      localStorage.setItem('token', token);  // Store JWT locally (free browser storage).
      console.log('Login successful');  // Log success (free).

      const decoded = jwtDecode<{ id: number; role: string }>(token);  // Decode token to get role (free jwt-decode).
      console.log('Role:', decoded.role);  // Log role for debugging (free).
      // Role-based redirect (free window.location; expand with react-router later for SPA navigation).
      if (decoded.role === 'STAFF' || decoded.role === 'ADMIN') {
        window.location.href = '/staff-dashboard';  // Redirect to staff view (placeholder, free).
      } else if (decoded.role === 'CLIENT') {
        window.location.href = '/client-dashboard';  // Redirect to client view (free).
      }
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