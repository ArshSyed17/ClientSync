# ClientSync - Final Setup with JSON Server

## What Was Changed

The application uses **JSON Server** (db.json) for local data persistence.

### Files Updated

1. **src/api/index.js**
   - Reverted to use Axios with JSON Server
   - API base URL: http://localhost:5000
   - All CRUD operations use REST API

2. **src/components/ProjectForm.jsx**
   - Uses camelCase (clientId, startDate, endDate)
   - Properly formats data for JSON Server

3. **src/components/InvoiceForm.jsx**
   - Uses camelCase (invoiceNumber, clientId, projectId, dueDate)
   - Cascading dropdowns work correctly

4. **src/pages/Projects.jsx**
   - Displays project.clientId and project.startDate

5. **src/pages/Invoices.jsx**
   - Displays invoice.invoiceNumber, invoice.clientId, invoice.dueDate

6. **src/pages/Dashboard.jsx**
   - Shows invoice.invoiceNumber
   - Calculates revenue from invoices
   - Enhanced UI with gradients and animations

## Database: db.json

Located at project root. Contains:
```json
{
  "clients": [...],
  "projects": [...],
  "invoices": [...]
}
```

## How to Run

### Quick Start
```bash
npm install
npm run start
```

### What Happens
1. JSON Server starts on port 5000
2. Vite dev server starts on port 5173
3. App connects to JSON Server API
4. All data saves to db.json

## Architecture

```
Frontend (React)
    ↓ HTTP Requests (Axios)
    ↓
JSON Server (port 5000)
    ↓ Read/Write
    ↓
db.json (file system)
```

## API Endpoints

- GET /clients - List all clients
- POST /clients - Create client
- PUT /clients/:id - Update client
- DELETE /clients/:id - Delete client
- (same for /projects and /invoices)

## Features Working

✅ Create, Read, Update, Delete (CRUD)
✅ Data persists in db.json
✅ Enhanced dashboard with revenue analytics
✅ Interactive stat cards
✅ Recent activity tracking
✅ Status badges and color coding
✅ Form validation
✅ Toast notifications
✅ Responsive design

## Important Notes

⚠️ **JSON Server MUST be running**
- Use `npm run start` to run both servers
- Or run `npm run server` separately

⚠️ **Port Requirements**
- Port 5000: JSON Server (backend)
- Port 5173: Vite (frontend)

⚠️ **Data Persistence**
- All data saved to db.json
- Backup db.json regularly
- Manual edits possible (restart server after)

## Enhanced Dashboard

New features added:
- Total Revenue calculation
- Paid Revenue tracking
- Pending Revenue monitoring
- Gradient stat cards with hover effects
- Quick Action buttons
- Clickable recent activity items
- Professional dark theme panel

## Troubleshooting

### "Error loading clients"
→ JSON Server not running. Run: `npm run server`

### Port 5000 in use
→ Change port in package.json and src/api/index.js

### Data not saving
→ Check JSON Server terminal for errors

### Connection refused
→ Verify JSON Server is on port 5000: http://localhost:5000/clients

## Build Status

✅ Build succeeds
✅ No errors
✅ Production ready

---

**Setup Complete! Run `npm run start` to begin.**
