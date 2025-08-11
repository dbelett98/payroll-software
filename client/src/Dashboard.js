// Dashboard.js: React component for PSB staff dashboard (fetches clients/employees from backend, uses open-source react-table v8 – free).
import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Free for API calls.
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';  // Free v8 import.

const Dashboard = () => {
  const [clients, setClients] = useState([]);  // State for clients.
  const [selectedClient, setSelectedClient] = useState(null);  // Selected client.
  const [employees, setEmployees] = useState([]);  // State for employees.

  // Fetch clients on mount.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/clients', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => setClients(response.data))
        .catch(error => console.error('Error fetching clients', error));
    }
  }, []);

  // Fetch employees when client selected.
  const fetchEmployees = async (clientId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`http://localhost:3000/employees?clientId=${clientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees', error);
      }
    }
  };

  // Table columns definition.
  const columns = React.useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'hoursWorked', header: 'Hours' },
    { accessorKey: 'salary', header: 'Salary' },
    { header: 'Actions', cell: () => <button className="bg-psb-blue text-white p-1">Edit</button> }
  ], []);

  const table = useReactTable({ data: employees, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="p-4">
      <h2>Staff Dashboard</h2>
      <select onChange={(e) => {
        const id = parseInt(e.target.value);
        setSelectedClient(id);
        fetchEmployees(id);
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