import React, { useState } from 'react';
import { Client } from '../types';
import ClientCard from '../Components/ClientCard';
import { useAppContext } from '../context/AppContext';
import { searchEntities } from '../Utils/helpers';

const ClientList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
    name: '',
    country: '',
    email: ''
  });

  const filteredClients = searchEntities(state.clients, searchTerm);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      ...newClient,
      id: Date.now().toString()
    };
    dispatch({ type: 'ADD_CLIENT', payload: client });
    setNewClient({ name: '', country: '', email: '' });
    setShowAddForm(false);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setNewClient({
      name: client.name,
      country: client.country,
      email: client.email || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      const updatedClient: Client = {
        ...editingClient,
        ...newClient
      };
      dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
      setEditingClient(null);
      setNewClient({ name: '', country: '', email: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client? This will also delete all associated projects and payments.')) {
      dispatch({ type: 'DELETE_CLIENT', payload: clientId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
        <button
          onClick={() => {
            setEditingClient(null);
            setNewClient({ name: '', country: '', email: '' });
            setShowAddForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </h3>
          <form onSubmit={editingClient ? handleUpdateClient : handleAddClient} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={newClient.country}
                onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingClient ? 'Update Client' : 'Add Client'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
          />
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No clients found matching your search.' : 'No clients added yet.'}
        </div>
      )}
    </div>
  );
};

export default ClientList;