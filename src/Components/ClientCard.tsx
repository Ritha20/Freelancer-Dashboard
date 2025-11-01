import React from 'react';
import { Client } from '../types';

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(client)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(client.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <span className="font-medium mr-2">Country:</span>
          <span>{client.country}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <span className="font-medium mr-2">Email:</span>
          <span>{client.email || 'No email provided'}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;