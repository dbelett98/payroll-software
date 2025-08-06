// Dashboard.js: React component for PSB staff dashboard (fetches clients/employees from backend, uses open-source react-table – free).
import React, { useEffect, useState } from 'react';  // Core React imports (free).
import axios from 'axios';  // Free for API calls.
import { useTable } from '@tanstack/react-table';  // Free table lib.

const Dashboard = () => {
  const [clients, setClients] = useState([]);  // State for client list (free React hook).
  const [selectedClient, setSelectedClient] = useState(null);  // Selected client ID (free).
  const [employees, setEmployees] = useState([]);  // State for employee data (free).

  // Fetch clients on mount (protected API call with token, free useEffect).
  useEffect(() => {
    const token = localStorage.getItem('token');  // Get stored token (free browser storage).
    if (token) {
      axios.get('http://localhost:3000/clients', {
        headers: { Authorization: `Bearer ${token}` }  // Send JWT for auth (free axios config).
      }).then(response => setClients(response.data))  // Set clients (free).
        .catch(error => console.error('Error fetching clients', error));  // Handle errors (free).
    }
  }, []);

  // Fetch employees when client selected (free async function).
  const fetchEmployees = async (clientId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`http://localhost:3000/employees?clientId=${clientId}`, {
          headers: { Authorization: `Bearer ${token}` }  // Protected call (free).
        });
        setEmployees(response.data);  // Set employee data (free).
      } catch (error) {
        console.error('Error fetching employees', error);  // Handle errors (free).
      }
    }
  };

  // Table columns definition (free react-table).
  const columns = React.useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'hoursWorked', header: 'Hours' },
    { accessorKey: 'salary', header: 'Salary' },
    { accessorKey: 'actions', header: 'Actions', cell: () => <button className="bg-psb-blue text-white p-1">Edit</button> }  // Simple edit button (free, expand later).
  ], []);

  const table = useTable({ data: employees, columns });  // Create table instance (free react-table).

  return (
    <div className="p-4">
      <h2>Staff Dashboard</h2> 
      <select onChange={(e) => {
        const id = parseInt(e.target.value);
        setSelectedClient(id);
        fetchEmployees(id);  // Fetch on selection (free event handler).
      }} className="mb-4 p-2 border">
        <option value="">Select Client</option>
        {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)} 
      </select>
      <table className="w-full border">
        <thead><tr>{table.getHeaderGroups().map(headerGroup => headerGroup.headers.map(header => <th key={header.id}>{header.renderHeader()}</th>))}</tr></thead> 
        <tbody>{table.getRowModel().rows.map(row => <tr key={row.id}>{row.getVisibleCells().map(cell => <td key={cell.id}>{cell.renderValue()}</td>)}</tr>)}</tbody> 
      </table>
    </div>
  );
};

export default Dashboard;