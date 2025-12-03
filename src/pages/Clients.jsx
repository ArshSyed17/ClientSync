import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getClients, deleteClient } from '../api';
import { FaEdit, FaTrash, FaPlus, FaEye, FaSearch } from 'react-icons/fa';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      toast.error('Error loading clients');
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete client "${name}"?`)) {
      try {
        await deleteClient(id);
        toast.success('Client deleted successfully!');
        loadClients();
      } catch (error) {
        toast.error('Error deleting client');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Clients</h1>
        <Link
          to="/clients/add"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition shadow-lg flex items-center space-x-2 font-medium transform hover:scale-105"
        >
          <FaPlus />
          <span>Add Client</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 border border-blue-100">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
          <input
            type="text"
            placeholder="Search clients by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg overflow-hidden border border-blue-100">
        {filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {client.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.company || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/clients/edit/${client.id}`}
                          className="text-cyan-600 hover:text-cyan-800 transition"
                          title="View/Edit"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/clients/edit/${client.id}`}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(client.id, client.name)}
                          className="text-pink-600 hover:text-pink-800 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {clients.length === 0 
                ? 'No clients found' 
                : 'No clients match your search criteria'}
            </p>
            {clients.length === 0 && (
              <Link
                to="/clients/add"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Add your first client
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
