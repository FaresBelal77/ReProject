# Frontend - ReProject

React frontend for the educational platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend directory:
```
PORT=3001
REACT_APP_API_URL=http://localhost:3000/api
```

**Note:** The frontend runs on port 3001 to avoid conflict with the backend on port 3000.

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3001`

## Features

- **Authentication**: Login and Register pages
- **Dashboard**: Child-friendly dashboard with games, leaderboard, and achievements
- **Games**: Browse and play educational games by subject
- **Monitoring**: Parent/Teacher monitoring dashboard
- **Safety**: Safety alerts and educational guidance
- **Achievements**: View unlocked and locked achievements

## Components Structure

- `components/Auth/` - Login and Register
- `components/Dashboard/` - Main dashboard
- `components/Games/` - Game list and gameplay
- `components/Monitoring/` - Monitoring dashboard
- `components/Safety/` - Safety alerts
- `components/Achievements/` - Achievements display
- `context/AuthContext.js` - Authentication context
- `services/api.js` - Axios API service

## API Connection

The frontend connects to the backend API at `http://localhost:3000/api`. Make sure the backend server is running on port 3000 before starting the frontend.

## Ports

- **Backend**: Port 3000
- **Frontend**: Port 3001
