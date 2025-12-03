import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getClients, getProjects, getInvoices } from '../api';
import { FaUserFriends, FaProjectDiagram, FaFileInvoiceDollar, FaPlus, FaCheckCircle, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    invoices: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    paidRevenue: 0,
  });
  const [recentClients, setRecentClients] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [clientsRes, projectsRes, invoicesRes] = await Promise.all([
        getClients(),
        getProjects(),
        getInvoices(),
      ]);

      const invoices = invoicesRes.data;
      const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
      const pendingRevenue = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + Number(inv.amount), 0);
      const paidRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + Number(inv.amount), 0);

      setStats({
        clients: clientsRes.data.length,
        projects: projectsRes.data.length,
        invoices: invoicesRes.data.length,
        totalRevenue,
        pendingRevenue,
        paidRevenue,
      });

      setRecentClients(clientsRes.data.slice(0, 3));
      setRecentProjects(projectsRes.data.slice(0, 3));
      setAllProjects(projectsRes.data);
      setRecentInvoices(invoicesRes.data.slice(0, 3));
    } catch (error) {
      toast.error('Error loading dashboard data');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-purple-600 mt-2 font-medium">Welcome back! Here's your business overview</p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/clients" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Clients</p>
              <p className="text-5xl font-bold mt-2">{stats.clients}</p>
              <p className="text-blue-100 text-sm mt-2">Active partnerships</p>
            </div>
            <FaUserFriends className="text-6xl text-blue-200 opacity-80" />
          </div>
        </Link>

        <Link to="/projects" className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Projects</p>
              <p className="text-5xl font-bold mt-2">{stats.projects}</p>
              <p className="text-green-100 text-sm mt-2">In portfolio</p>
            </div>
            <FaProjectDiagram className="text-6xl text-green-200 opacity-80" />
          </div>
        </Link>

        <Link to="/invoices" className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Total Invoices</p>
              <p className="text-5xl font-bold mt-2">{stats.invoices}</p>
              <p className="text-amber-100 text-sm mt-2">Documents issued</p>
            </div>
            <FaFileInvoiceDollar className="text-6xl text-amber-200 opacity-80" />
          </div>
        </Link>
      </div>

      {/* Revenue Stats with Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-slate-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <span className="text-4xl text-slate-500 font-bold">₹</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-slate-500 to-slate-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Paid Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-2">₹{stats.paidRevenue.toLocaleString('en-IN')}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-500" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
              style={{ width: stats.totalRevenue > 0 ? `${(stats.paidRevenue / stats.totalRevenue) * 100}%` : '0%' }}
            ></div>
          </div>
          {stats.totalRevenue > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {((stats.paidRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Revenue</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">₹{stats.pendingRevenue.toLocaleString('en-IN')}</p>
            </div>
            <FaClock className="text-4xl text-amber-500" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" 
              style={{ width: stats.totalRevenue > 0 ? `${(stats.pendingRevenue / stats.totalRevenue) * 100}%` : '0%' }}
            ></div>
          </div>
          {stats.totalRevenue > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {((stats.pendingRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total
            </p>
          )}
        </div>
      </div>

      {/* Projects by Status Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Projects by Status</h2>
        <div className="space-y-4">
          {['not-started', 'in-progress', 'completed', 'on-hold'].map((status) => {
            const count = allProjects.filter(p => p.status === status).length;
            const total = allProjects.length || 1;
            const percentage = (count / total) * 100;
            const statusLabels = {
              'not-started': 'Not Started',
              'in-progress': 'In Progress',
              'completed': 'Completed',
              'on-hold': 'On Hold'
            };
            const statusColors = {
              'not-started': 'from-gray-400 to-gray-500',
              'in-progress': 'from-blue-400 to-cyan-400',
              'completed': 'from-green-400 to-emerald-400',
              'on-hold': 'from-amber-400 to-orange-400'
            };
            return (
              <div key={status}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{statusLabels[status]}</span>
                  <span className="text-sm text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`bg-gradient-to-r ${statusColors[status]} h-3 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Items */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Clients */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaUserFriends className="mr-2 text-blue-500" />
                Recent Clients
              </h3>
              <Link
                to="/clients/add"
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                title="Add Client"
              >
                <FaPlus className="text-sm" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentClients.length > 0 ? (
                recentClients.map((client) => (
                  <Link
                    key={client.id}
                    to={`/clients/edit/${client.id}`}
                    className="block border-b border-gray-100 pb-3 hover:bg-blue-50 p-2 rounded transition"
                  >
                    <p className="font-medium text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    <p className="text-xs text-gray-500 mt-1">{client.company || 'No company'}</p>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No clients yet</p>
              )}
            </div>
            <Link
              to="/clients"
              className="text-blue-600 hover:text-blue-800 text-sm mt-4 block text-center font-medium"
            >
              View all clients →
            </Link>
          </div>

          {/* Recent Projects */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaProjectDiagram className="mr-2 text-green-500" />
                Recent Projects
              </h3>
              <Link
                to="/projects/add"
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
                title="Add Project"
              >
                <FaPlus className="text-sm" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/edit/${project.id}`}
                    className="block border-b border-gray-100 pb-3 hover:bg-green-50 p-2 rounded transition"
                  >
                    <p className="font-medium text-gray-800">{project.title}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'on-hold' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status.replace('-', ' ')}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">₹{project.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No projects yet</p>
              )}
            </div>
            <Link
              to="/projects"
              className="text-green-600 hover:text-green-800 text-sm mt-4 block text-center font-medium"
            >
              View all projects →
            </Link>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaFileInvoiceDollar className="mr-2 text-amber-500" />
                Recent Invoices
              </h3>
              <Link
                to="/invoices/add"
                className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition"
                title="Add Invoice"
              >
                <FaPlus className="text-sm" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    to={`/invoices/edit/${invoice.id}`}
                    className="block border-b border-gray-100 pb-3 hover:bg-amber-50 p-2 rounded transition"
                  >
                    <p className="font-medium text-gray-800">{invoice.invoiceNumber}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                      <span className="text-sm text-gray-800 font-semibold">₹{invoice.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No invoices yet</p>
              )}
            </div>
            <Link
              to="/invoices"
              className="text-amber-600 hover:text-amber-800 text-sm mt-4 block text-center font-medium"
            >
              View all invoices →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/clients/add"
            className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-4 rounded-lg flex items-center space-x-3 transition"
          >
            <FaUserFriends className="text-2xl" />
            <span className="font-medium">Add New Client</span>
          </Link>
          <Link
            to="/projects/add"
            className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-4 rounded-lg flex items-center space-x-3 transition"
          >
            <FaProjectDiagram className="text-2xl" />
            <span className="font-medium">Create Project</span>
          </Link>
          <Link
            to="/invoices/add"
            className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-4 rounded-lg flex items-center space-x-3 transition"
          >
            <FaFileInvoiceDollar className="text-2xl" />
            <span className="font-medium">Generate Invoice</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
