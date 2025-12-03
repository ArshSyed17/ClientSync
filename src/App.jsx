import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import AddClient from './pages/AddClient';
import EditClient from './pages/EditClient';
import Projects from './pages/Projects';
import AddProject from './pages/AddProject';
import EditProject from './pages/EditProject';
import Invoices from './pages/Invoices';
import AddInvoice from './pages/AddInvoice';
import EditInvoice from './pages/EditInvoice';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/add" element={<AddClient />} />
            <Route path="/clients/edit/:id" element={<EditClient />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/add" element={<AddProject />} />
            <Route path="/projects/edit/:id" element={<EditProject />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/add" element={<AddInvoice />} />
            <Route path="/invoices/edit/:id" element={<EditInvoice />} />
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
