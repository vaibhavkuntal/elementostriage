# Setup Guide

## Quick Start

1. **Install Frontend Dependencies:**
```bash
npm install
```

2. **Install Backend Dependencies:**

**PowerShell:**
```powershell
cd server; npm install; cd ..
```

**Command Prompt (cmd):**
```cmd
cd server && npm install && cd ..
```

**Bash/Git Bash:**
```bash
cd server && npm install && cd ..
```

3. **Start Both Servers:**
```bash
npm run dev:all
```

This will start:
- Frontend dev server on `http://localhost:5173`
- Backend API server on `http://localhost:3001`

## Manual Start (Alternative)

If you prefer to run them separately:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory (optional):
```
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

## Database

The database (`server/shadowledger.db`) will be created automatically on first run with sample data.

## Features

- ✅ Backend API with Express
- ✅ SQLite database
- ✅ Corruption reporting system
- ✅ AI-powered analysis
- ✅ GTA 6-inspired neon pink theme
- ✅ Improved network graph visualization

## Troubleshooting

**Port already in use:**
- Change the port in `server/index.js` or set `PORT` environment variable

**Database errors:**
- Delete `server/shadowledger.db` to reset the database

**CORS errors:**
- Make sure backend is running on port 3001
- Check that `VITE_API_URL` matches your backend URL
