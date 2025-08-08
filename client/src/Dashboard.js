// Dashboard.js: React component for PSB staff dashboard (fetches clients/employees from backend, uses open-source react-table v8 – free).
import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Free for API calls.
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';  // Free v8 import (useReactTable, getCoreRowModel).

const Dashboard = () => {
  const [clients, setClients] = useState([]);  // State for clients (free useState).
  const [selectedClient, setSelectedClient] = useState(null);  // Selected client (free).
  const [employees, setEmployees] = useState([]);  // State for employees (free).

  // Fetch clients on mount (protected API call with token, free useEffect).
  useEffect(() => {
    const token = localStorage.getItem('token');  // Get token (free).
    if (token) {
      axios.get('http://localhost:3000/clients', {
        headers: { Authorization: `Bearer ${token}` }  // Protected call (free).
      }).then(response => setClients(response.data))  // Set clients (free).
        .catch(error => console.error('Error fetching clients', error));  // Handle error (free).
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
        setEmployees(response.data);  // Set employees (free).
      } catch (error) {
        console.error('Error fetching employees', error);  // Handle error (free).
      }
    }
  };

  // Table columns definition (free react-table v8).
  const columns = React.useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'hoursWorked', header: 'Hours' },
    { accessorKey: 'salary', header: 'Salary' },
    { header: 'Actions', cell: () => <button className="bg-psb-blue text-white p-1">Edit</button> }  // Edit button (free).
  ], []);  // Columns for table (free useMemo).

  const table = useReactTable({ data: employees, columns, getCoreRowModel: getCoreRowModel() });  // Table instance (free useReactTable with core model).

  return (
    <div className="p-4">
      <h2>Staff Dashboard</h2>
      <select onChange={(e) => {
        const id = parseInt(e.target.value);
        setSelectedClient(id);
        fetchEmployees(id);  // Fetch employees (free).
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