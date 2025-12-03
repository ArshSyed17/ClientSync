import { Link } from 'react-router-dom';
import { FaUserFriends, FaProjectDiagram, FaFileInvoiceDollar, FaHome } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:text-purple-200 transition transform hover:scale-105">
            <FaHome className="text-2xl" />
            <span>ClientSync</span>
          </Link>

          <div className="flex space-x-6">
            <Link
              to="/clients"
              className="flex items-center space-x-2 hover:text-purple-200 transition transform hover:scale-110"
            >
              <FaUserFriends />
              <span>Clients</span>
            </Link>

            <Link
              to="/projects"
              className="flex items-center space-x-2 hover:text-purple-200 transition transform hover:scale-110"
            >
              <FaProjectDiagram />
              <span>Projects</span>
            </Link>

            <Link
              to="/invoices"
              className="flex items-center space-x-2 hover:text-purple-200 transition transform hover:scale-110"
            >
              <FaFileInvoiceDollar />
              <span>Invoices</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
