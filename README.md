ClientSync – Freelancer CRM (React + JSON Server)

ClientSync is a lightweight and modern CRM application built for freelancers to manage their clients, projects, and invoices in one place. The system provides a clean user interface, fast performance, and structured data management using React on the frontend and JSON Server on the backend.

Project Description

ClientSync is designed to help freelancers and small teams streamline their workflow. It allows users to:

Manage client information

Track ongoing and completed projects

Create and update invoices

View real-time revenue insights

Access a dashboard with summarized business statistics

The project demonstrates core React concepts such as components, routing, hooks, state management, and API integration. It also uses Tailwind CSS for styling, Axios for API calls, and JSON Server as a mock backend.

Features
Dashboard

Overall statistics (clients, projects, invoices)

Revenue analysis (total, paid, pending)

Recent activity

Project status distribution

Clients Module

Add, edit, delete clients

View all clients

Search clients

Projects Module

Add, edit, delete projects

Assign clients to a project

Track status and project amount

Invoices Module

Create invoices linked to clients and projects

Update invoice status

View invoice list

General Features

Responsive UI

Clean navigation

Toast notifications

Fast performance using Vite

Tech Stack

Frontend: React.js
Styling: Tailwind CSS
Backend: JSON Server
API Handling: Axios
Routing: React Router DOM
Notifications: React Toastify
Build Tool: Vite

Installation and Setup
1. Clone the repository
git clone https://github.com/ArshSyed17/ClientSync.git
cd ClientSync

2. Install dependencies
npm install

3. Start JSON Server (backend)
npm run server


JSON Server runs at:
http://localhost:5000/

4. Start React development server
npm run dev


React app runs at:
http://localhost:5173/

API Endpoints
Clients
GET    /clients
POST   /clients
PUT    /clients/:id
DELETE /clients/:id

Projects
GET    /projects
POST   /projects
PUT    /projects/:id
DELETE /projects/:id

Invoices
GET    /invoices
POST   /invoices
PUT    /invoices/:id
DELETE /invoices/:id

Project Folder Structure
ClientSync/
│── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
│── db.json
│── package.json
│── tailwind.config.js
│── postcss.config.js

Future Enhancements

Login and authentication

Cloud database support

PDF invoice download

Analytics charts

Dark mode

Multi-user access

Conclusion

ClientSync provides a complete CRM workflow for freelancers by combining React’s efficiency with JSON Server’s simplicity. It includes structured modules, clear navigation, and essential CRUD operations, making it suitable for real-world use and academic demonstration.
