import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clients API
export const getClients = () => api.get('/clients');
export const getClient = (id) => api.get(`/clients/${id}`);
export const createClient = (client) => api.post('/clients', client);
export const updateClient = (id, client) => api.put(`/clients/${id}`, client);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

// Projects API
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (project) => api.post('/projects', project);
export const updateProject = (id, project) => api.put(`/projects/${id}`, project);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Invoices API
export const getInvoices = () => api.get('/invoices');
export const getInvoice = (id) => api.get(`/invoices/${id}`);
export const createInvoice = (invoice) => api.post('/invoices', invoice);
export const updateInvoice = (id, invoice) => api.put(`/invoices/${id}`, invoice);
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`);

export default api;
