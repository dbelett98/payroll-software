// Dashboard.tsx: React component for PSB staff dashboard (fetches clients/employees from backend, uses open-source react-table – free).
import React, { useEffect, useState } from 'react';  // Core React imports (free).
import axios from 'axios';  // Free for API calls.
import { useTable, Column } from '@tanstack/react-table';  // Free table lib.

interface Client {
  id: number;
  name: string;
}

interface Employee {
  name: string;
  hoursWorked: number;
  salary: number;
}

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);  // State for client list (free React hook).
  const [selectedClient, setSelectedClient] = useState<number | null>(null);  // Selected client ID (free).
  const [employees, setEmployees] = useState<Employee[]>([]);  // State for employee data (free).

  // Fetch clients on mount (protected API call with token, free useEffect).
  useEffect(() => {
    const token = localStorage.getItem('token');  // Get stored token (free browser storage).
    if (token) {
      axios.get('http://localhost:3000/clients', {
        headers: { Authorization: `Bearer ${token}` }  // Send JWT for auth (free axios config).
      }).then((response: any) => setClients(response.data))  // Set clients (explicit 'any' type for response – free fix for implicit 'any').
        .catch((error: any) => console.error('Error fetching clients', error));  // Handle errors (explicit 'any' type for error – free).
    }
  }, []);

  // Fetch employees when client selected (free async function).
  const fetchEmployees = async (clientId: number) => {
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

  // Table columns definition (free react-table, with explicit Column type for TS safety).
  const columns: Column<Employee>[] = React.useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'hoursWorked', header: 'Hours' },
    { accessorKey: 'salary', header: 'Salary' },
    { accessorKey: 'actions', header: 'Actions', cell: () => <button className="bg-psb-blue text-white p-1">Edit</button> }  // Simple edit button (free, expand later).
  ], []);

  const table = useTable({ data: employees, columns });  // Create table instance (free react-table).

  return (
    <div className="p-4">
      <h2>Staff Dashboard</h2> {/* Header (free). */}
      <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {  // Explicit type for 'e' (free TS annotation to fix implicit 'any').
        const id = parseInt(e.target.value);
        setSelectedClient(id);
        fetchEmployees(id);  // Fetch on selection (free event handler).
      }} className="mb-4 p-2 border">
        <option value="">Select Client</option>
        {clients.map((client: Client) => <option key={client.id} value={client.id}>{client.name}</option>)} {/* Dropdown from clients (free map; explicit type for 'client'). */}
      </select>
      <table className="w-full border">
        <thead><tr>{table.getHeaderGroups().map((headerGroup: any) => headerGroup.headers.map((header: any) => <th key={header.id}>{header.renderHeader()}</th>))}</tr></thead> {/* Table headers (free react-table; explicit 'any' for 'headerGroup' and 'header' to fix implicit 'any'). */}
        <tbody>{table.getRowModel().rows.map((row: any) => <tr key={row.id}>{row.getVisibleCells().map((cell: any) => <td key={cell.id}>{cell.renderValue()}</td>)}</tr>)}</tbody> {/* Table rows (free; explicit 'any' for 'row' and 'cell' to fix implicit 'any'). */}
      </table>
    </div>
  );
};

export default Dashboard;