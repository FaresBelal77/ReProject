# ReProject - MERN Stack Educational Platform

A MERN stack application for children's educational gaming platform with serious games, monitoring, and safety features.

## Features

- **FR-01**: Child-friendly dashboard with gamified elements (leaderboard, points, achievements)
- **FR-02**: Serious games aligned with school curricula (math, physics, chemistry, language, coding)
- **FR-03**: Creative sandbox activities for learning reinforcement
- **FR-04**: Parent/teacher monitoring module (screen-time, content accessed, behavioral patterns)
- **FR-05**: Safety detection system for unsafe behaviors with educational guidance

## Project Structure

```
ReProject/
├── server.js                 # Main entry point
├── package.json              # Dependencies
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   ├── Game.js              # Game schema
│   ├── Session.js           # Game session schema
│   ├── Achievement.js       # Achievement schema
│   ├── Monitoring.js        # Monitoring data schema
│   └── SafetyAlert.js       # Safety alert schema
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── dashboardController.js  # Dashboard logic
│   ├── gameController.js    # Game logic
│   ├── monitoringController.js # Monitoring logic
│   └── safetyController.js # Safety detection logic
└── routes/
    ├── auth.js              # Auth routes
    ├── dashboard.js         # Dashboard routes
    ├── games.js             # Game routes
    ├── monitoring.js        # Monitoring routes
    └── safety.js            # Safety routes
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb+srv://omarabdalla_db_user:1234@cluster0.9nyfqde.mongodb.net/?appName=Cluster0
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Dashboard
- `GET /api/dashboard` - Get dashboard data (protected)
- `GET /api/dashboard/games/subject/:subject` - Get games by subject (protected)
- `GET /api/dashboard/creative` - Get creative activities (protected)
- `GET /api/dashboard/achievements` - Get achievements (protected)

### Games
- `GET /api/games` - Get all games (protected)
- `GET /api/games/:gameId` - Get game details (protected)
- `POST /api/games/:gameId/start` - Start a game session (protected)
- `POST /api/games/session/:sessionId/answer` - Submit answer (protected)
- `POST /api/games/session/:sessionId/creative` - Save creative work (protected)
- `POST /api/games/session/:sessionId/end` - End game session (protected)

### Monitoring
- `GET /api/monitoring/children` - Get children list (parent/teacher only)
- `GET /api/monitoring/:userId` - Get monitoring data (protected)
- `POST /api/monitoring/update` - Update daily monitoring (protected)

### Safety
- `POST /api/safety/detect` - Detect unsafe behavior (protected)
- `GET /api/safety/alerts/:userId` - Get safety alerts (protected)
- `GET /api/safety/statistics/:userId` - Get safety statistics (protected)
- `PUT /api/safety/alerts/:alertId/resolve` - Resolve alert (parent/teacher/admin only)

## User Roles

- **child**: Can play games, view dashboard, earn points
- **parent**: Can monitor children, view safety alerts
- **teacher**: Can monitor all children, view safety alerts
- **admin**: Full access

## Database Models

### User
- Authentication and profile information
- Points, level, achievements
- Role-based access

### Game
- Game content and metadata
- Subject alignment (math, physics, chemistry, language, coding)
- Difficulty levels and point rewards

### Session
- Game session tracking
- Answers and progress
- Creative work storage

### Achievement
- Achievement definitions
- Unlock requirements
- Point rewards

### Monitoring
- Daily screen time tracking
- Content access logs
- Behavioral patterns

### SafetyAlert
- Safety incident tracking
- Educational guidance
- Resolution status

## Notes

- All protected routes require JWT token in Authorization header: `Bearer <token>`
- Password hashing is handled automatically
- Safety detection uses keyword matching (can be enhanced with ML/AI)
- Monitoring data is updated automatically after game sessions

