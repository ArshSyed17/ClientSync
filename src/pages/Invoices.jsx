import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getInvoices, deleteInvoice, getClients, getProjects } from '../api';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilePdf } from 'react-icons/fa';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invoicesRes, clientsRes, projectsRes] = await Promise.all([
        getInvoices(),
        getClients(),
        getProjects(),
      ]);
      setInvoices(invoicesRes.data);
      setClients(clientsRes.data);
      setProjects(projectsRes.data);
      setFilteredInvoices(invoicesRes.data);
    } catch (error) {
      toast.error('Error loading invoices');
    }
  };

  useEffect(() => {
    let filtered = invoices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getClientName(invoice.clientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProjectTitle(invoice.projectId).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  }, [searchTerm, statusFilter, invoices, clients, projects]);

  const getClientName = (clientId) => {
    if (!clientId) return 'Unknown';
    const client = clients.find((c) => String(c.id) === String(clientId));
    return client ? client.name : 'Unknown';
  };

  const getProjectTitle = (projectId) => {
    if (!projectId) return 'No Project';
    const project = projects.find((p) => String(p.id) === String(projectId));
    return project ? project.title : 'Unknown Project';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white',
      paid: 'bg-gradient-to-r from-green-400 to-emerald-400 text-white',
      overdue: 'bg-gradient-to-r from-red-400 to-pink-400 text-white',
      cancelled: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800',
    };
    return colors[status] || 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
  };

  const handleDelete = async (id, invoiceNumber) => {
    if (
      window.confirm(`Are you sure you want to delete invoice "${invoiceNumber}"?`)
    ) {
      try {
        await deleteInvoice(id);
        toast.success('Invoice deleted successfully!');
        loadData();
      } catch (error) {
        toast.error('Error deleting invoice');
      }
    }
  };

  const handleExportPDF = (invoice) => {
    const client = clients.find(c => String(c.id) === String(invoice.clientId));
    const clientName = client ? client.name : 'Unknown';
    
    const pdfContent = `
INVOICE
${invoice.invoiceNumber}

Date: ${new Date(invoice.date).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

Bill To:
${clientName}

Amount: ₹${invoice.amount.toLocaleString('en-IN')}
Status: ${invoice.status.toUpperCase()}

Description:
${invoice.description || 'N/A'}
    `.trim();

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoice.invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Invoice exported!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Invoices</h1>
        <Link
          to="/invoices/add"
          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition shadow-lg flex items-center space-x-2 font-medium transform hover:scale-105"
        >
          <FaPlus />
          <span>Add Invoice</span>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg p-4 border border-amber-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg overflow-hidden border border-amber-100">
        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Export
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-amber-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getProjectTitle(invoice.projectId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getClientName(invoice.clientId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        ₹{invoice.amount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/invoices/edit/${invoice.id}`}
                          className="text-amber-600 hover:text-amber-800 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(invoice.id, invoice.invoiceNumber)
                          }
                          className="text-pink-600 hover:text-pink-800 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleExportPDF(invoice)}
                        className="text-red-600 hover:text-red-800 transition flex items-center space-x-1"
                        title="Export PDF"
                      >
                        <FaFilePdf />
                        <span className="text-xs">PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {invoices.length === 0 
                ? 'No invoices found' 
                : 'No invoices match your search/filter criteria'}
            </p>
            {invoices.length === 0 && (
              <Link
                to="/invoices/add"
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                Add your first invoice
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
