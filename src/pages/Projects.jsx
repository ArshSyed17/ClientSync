import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProjects, deleteProject, getClients } from '../api';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, clientsRes] = await Promise.all([
        getProjects(),
        getClients(),
      ]);
      setProjects(projectsRes.data);
      setClients(clientsRes.data);
      setFilteredProjects(projectsRes.data);
    } catch (error) {
      toast.error('Error loading projects');
    }
  };

  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter, projects]);

  const getClientNames = (project) => {
    // Handle both old format (clientId) and new format (clientIds)
    const clientIds = project.clientIds || (project.clientId ? [project.clientId] : []);
    if (clientIds.length === 0) return ['No clients'];
    
    return clientIds.map(clientId => {
      const client = clients.find((c) => String(c.id) === String(clientId));
      return client ? client.name : 'Unknown';
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'not-started': 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800',
      'in-progress': 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white',
      'completed': 'bg-gradient-to-r from-green-400 to-emerald-400 text-white',
      'on-hold': 'bg-gradient-to-r from-amber-400 to-orange-400 text-white',
    };
    return colors[status] || 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      try {
        await deleteProject(id);
        toast.success('Project deleted successfully!');
        loadData();
      } catch (error) {
        toast.error('Error deleting project');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Projects</h1>
        <Link
          to="/projects/add"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg flex items-center space-x-2 font-medium transform hover:scale-105"
        >
          <FaPlus />
          <span>Add Project</span>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-4 border border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg overflow-hidden border border-purple-100">
        {filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Clients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {filteredProjects.map((project) => {
                  const clientNames = getClientNames(project);
                  return (
                    <tr key={project.id} className="hover:bg-purple-50 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {project.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {clientNames.map((name, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          ₹{project.amount.toLocaleString('en-IN')}
                        </div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/projects/edit/${project.id}`}
                          className="text-purple-600 hover:text-purple-800 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="text-pink-600 hover:text-pink-800 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/projects/edit/${project.id}`}
                          className="text-purple-600 hover:text-purple-800 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="text-pink-600 hover:text-pink-800 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {projects.length === 0 
                ? 'No projects found' 
                : 'No projects match your search/filter criteria'}
            </p>
            {projects.length === 0 && (
              <Link
                to="/projects/add"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Add your first project
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
