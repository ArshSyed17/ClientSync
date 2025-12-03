import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createClient, updateClient } from '../api';

const ClientForm = ({ client, isEdit = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        company: client.company || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        notes: client.notes || '',
      });
    }
  }, [client]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/\D/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter a client name');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    try {
      const dataToSend = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        createdAt: client?.createdAt || new Date().toISOString(),
      };

      if (isEdit) {
        await updateClient(client.id, dataToSend);
        toast.success('Client updated successfully!');
      } else {
        await createClient(dataToSend);
        toast.success('Client created successfully!');
      }
      navigate('/clients');
    } catch (error) {
      toast.error('Error saving client: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg border border-blue-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
          />
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition shadow-lg font-medium transform hover:scale-105"
        >
          {isEdit ? 'Update Client' : 'Create Client'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/clients')}
          className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 px-6 py-3 rounded-lg hover:from-gray-400 hover:to-gray-500 transition shadow-md font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
