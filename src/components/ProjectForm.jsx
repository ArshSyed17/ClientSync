import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProject, updateProject, getClients } from '../api';

const ProjectForm = ({ project, isEdit = false }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientIds: [],
    title: '',
    description: '',
    status: 'not-started',
    startDate: '',
    endDate: '',
    amount: '',
  });

  useEffect(() => {
    loadClients();
    if (project) {
      // Handle both old format (clientId) and new format (clientIds)
      const clientIds = project.clientIds 
        ? project.clientIds.map(id => String(id))
        : project.clientId 
          ? [String(project.clientId)]
          : [];
      
      setFormData({
        clientIds: clientIds,
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'not-started',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        endDate: project.endDate ? project.endDate.split('T')[0] : '',
        amount: project.amount || '',
      });
    }
  }, [project]);

  const loadClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data);
    } catch (error) {
      toast.error('Error loading clients');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClientToggle = (clientId) => {
    const clientIdStr = String(clientId);
    setFormData({
      ...formData,
      clientIds: formData.clientIds.includes(clientIdStr)
        ? formData.clientIds.filter((id) => id !== clientIdStr)
        : [...formData.clientIds, clientIdStr],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.clientIds.length === 0) {
      toast.error('Please select at least one client');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a project title');
      return;
    }
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      const dataToSend = {
        clientIds: formData.clientIds,
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        amount: Number(formData.amount),
        createdAt: project?.createdAt || new Date().toISOString(),
      };

      if (isEdit) {
        await updateProject(project.id, dataToSend);
        toast.success('Project updated successfully!');
      } else {
        await createProject(dataToSend);
        toast.success('Project created successfully!');
      }
      navigate('/projects');
    } catch (error) {
      toast.error('Error saving project: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-lg border border-purple-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-purple-700 mb-2">
            Clients * (Select one or more)
          </label>
          <div className="space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border-2 border-purple-200 rounded-lg bg-white">
              {clients.length > 0 ? (
                clients.map((client) => (
                  <label
                    key={client.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer border-2 transition ${
                      formData.clientIds.includes(String(client.id))
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500'
                        : 'bg-white border-purple-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.clientIds.includes(String(client.id))}
                      onChange={() => handleClientToggle(client.id)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium">{client.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 col-span-full text-center py-4">No clients available. Add clients first.</p>
              )}
            </div>
            {formData.clientIds.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-purple-600 mb-1">Selected Clients ({formData.clientIds.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {formData.clientIds.map((clientId) => {
                    const client = clients.find(c => String(c.id) === clientId);
                    return client ? (
                      <span
                        key={clientId}
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs"
                      >
                        <span>{client.name}</span>
                        <button
                          type="button"
                          onClick={() => handleClientToggle(clientId)}
                          className="ml-1 hover:text-purple-200 transition"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-purple-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-2">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-2">
            Amount *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-2">
            End Date *
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition"
          />
        </div>

      </div>

      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg font-medium transform hover:scale-105"
        >
          {isEdit ? 'Update Project' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 px-6 py-3 rounded-lg hover:from-gray-400 hover:to-gray-500 transition shadow-md font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
