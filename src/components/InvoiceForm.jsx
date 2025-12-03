import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createInvoice, updateInvoice, getClients, getProjects, getInvoices } from '../api';

const InvoiceForm = ({ invoice, isEdit = false }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectClients, setProjectClients] = useState([]);
  const [selectedProjectRevenue, setSelectedProjectRevenue] = useState(0);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: '',
    projectId: '',
    date: '',
    dueDate: '',
    amount: '',
    status: 'pending',
    description: '',
  });

  useEffect(() => {
    loadClientsAndProjects();
    if (invoice) {
      // Set projectId first, then clientId will be set after project clients are loaded
      setFormData({
        invoiceNumber: invoice.invoiceNumber || '',
        clientId: invoice.clientId ? String(invoice.clientId) : '',
        projectId: invoice.projectId ? String(invoice.projectId) : '',
        date: invoice.date ? invoice.date.split('T')[0] : '',
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : '',
        amount: invoice.amount || '',
        status: invoice.status || 'pending',
        description: invoice.description || '',
      });
    } else {
      generateInvoiceNumber();
    }
  }, [invoice]);

  useEffect(() => {
    // When project is selected, filter clients that belong to that project and calculate revenue
    if (formData.projectId) {
      const selectedProject = projects.find(p => String(p.id) === String(formData.projectId));
      if (selectedProject) {
        // Handle both old format (clientId) and new format (clientIds)
        const projectClientIds = selectedProject.clientIds || (selectedProject.clientId ? [selectedProject.clientId] : []);
        const filtered = clients.filter(client => 
          projectClientIds.includes(String(client.id))
        );
        setProjectClients(filtered);
        
        // Calculate total revenue from all invoices for this project
        loadProjectRevenue(formData.projectId);
        
        // If current clientId is not in the project's clients, clear it
        if (formData.clientId && !projectClientIds.includes(formData.clientId)) {
          setFormData(prev => ({ ...prev, clientId: '' }));
        }
      } else {
        setProjectClients([]);
        setSelectedProjectRevenue(0);
      }
    } else {
      setProjectClients([]);
      setSelectedProjectRevenue(0);
      // Clear client selection when project is cleared
      if (formData.clientId) {
        setFormData(prev => ({ ...prev, clientId: '' }));
      }
    }
  }, [formData.projectId, projects, clients]);

  const loadProjectRevenue = async (projectId) => {
    try {
      const invoicesRes = await getInvoices();
      const projectInvoices = invoicesRes.data.filter(
        inv => String(inv.projectId) === String(projectId)
      );
      const totalRevenue = projectInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
      setSelectedProjectRevenue(totalRevenue);
    } catch (error) {
      console.error('Error loading project revenue:', error);
      setSelectedProjectRevenue(0);
    }
  };

  const loadClientsAndProjects = async () => {
    try {
      const [clientsRes, projectsRes] = await Promise.all([
        getClients(),
        getProjects(),
      ]);
      setClients(clientsRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      toast.error('Error loading data');
    }
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: `INV-${year}-${random}`,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'projectId') {
      // When project changes, clear client selection
      setFormData({
        ...formData,
        projectId: value,
        clientId: '', // Clear client when project changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.invoiceNumber.trim()) {
      toast.error('Please enter an invoice number');
      return;
    }
    
    if (!formData.projectId) {
      toast.error('Please select a project first');
      return;
    }
    
    if (!formData.clientId) {
      toast.error('Please select a client from the project');
      return;
    }
    
    // Verify that selected client belongs to the selected project
    const selectedProject = projects.find(p => String(p.id) === String(formData.projectId));
    if (selectedProject) {
      const projectClientIds = selectedProject.clientIds || (selectedProject.clientId ? [selectedProject.clientId] : []);
      if (!projectClientIds.includes(String(formData.clientId))) {
        toast.error('Selected client does not belong to the selected project');
        return;
      }
    }
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!formData.date) {
      toast.error('Please select a date');
      return;
    }
    
    if (!formData.dueDate) {
      toast.error('Please select a due date');
      return;
    }
    
    if (new Date(formData.dueDate) < new Date(formData.date)) {
      toast.error('Due date cannot be before invoice date');
      return;
    }
    
    try {
      const dataToSend = {
        invoiceNumber: formData.invoiceNumber.trim(),
        clientId: formData.clientId ? String(formData.clientId) : null,
        projectId: formData.projectId ? String(formData.projectId) : null,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        status: formData.status,
        description: formData.description.trim(),
        createdAt: invoice?.createdAt || new Date().toISOString(),
      };

      if (isEdit) {
        await updateInvoice(invoice.id, dataToSend);
        toast.success('Invoice updated successfully!');
      } else {
        await createInvoice(dataToSend);
        toast.success('Invoice created successfully!');
      }
      navigate('/invoices');
    } catch (error) {
      toast.error('Error saving invoice: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-amber-50 p-6 rounded-xl shadow-lg border border-amber-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Invoice Number *
          </label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Project * (Select project first)
          </label>
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          {formData.projectId && projectClients.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">⚠️ This project has no clients assigned</p>
          )}
          {formData.projectId && selectedProjectRevenue > 0 && (
            <div className="mt-2 p-2 bg-amber-100 rounded-lg border border-amber-300">
              <p className="text-xs font-medium text-amber-800">
                Project Total Revenue: <span className="font-bold">₹{selectedProjectRevenue.toLocaleString('en-IN')}</span>
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Client * (From selected project)
          </label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            required
            disabled={!formData.projectId || projectClients.length === 0}
            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white disabled:bg-amber-50 transition"
          >
            <option value="">
              {!formData.projectId 
                ? 'Select a project first' 
                : projectClients.length === 0 
                  ? 'No clients in this project' 
                  : 'Select a client'}
            </option>
            {projectClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {formData.projectId && projectClients.length > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              {projectClients.length} client(s) available for this project
            </p>
          )}
          {formData.projectId && selectedProjectRevenue > 0 && (
            <div className="mt-2 p-2 bg-amber-100 rounded-lg border border-amber-300">
              <p className="text-xs font-medium text-amber-800">
                Project Total Revenue: <span className="font-bold">₹{selectedProjectRevenue.toLocaleString('en-IN')}</span>
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
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
            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Due Date *
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
          />
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition shadow-lg font-medium transform hover:scale-105"
        >
          {isEdit ? 'Update Invoice' : 'Create Invoice'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/invoices')}
          className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 px-6 py-3 rounded-lg hover:from-gray-400 hover:to-gray-500 transition shadow-md font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
