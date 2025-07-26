// LoginForm.tsx: React component for login form (updated for visible text with text-black, free Tailwind).
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
      console.log('Login successful');  // Redirect or update UI here.

      const decoded = jwtDecode<{ role: string }>(token);  // Decode to get role (free).
      console.log('Role:', decoded.role);  // Use for conditional UI.
    } catch (error) {
      console.error('Login failed', error);  // Handle errors.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white rounded shadow">  // Tailwind CSS (free styling).
      <input {...register('email')} placeholder="Email" className="mb-2 p-2 border text-black" />  // Added text-black for visibility (free).
      <input {...register('password')} type="password" placeholder="Password" className="mb-2 p-2 border text-black" />  // Added text-black.
      <button type="submit" className="bg-psb-blue text-white p-2">Login</button>  // Custom color from Tailwind config.
    </form>
  );
};

export default LoginForm;