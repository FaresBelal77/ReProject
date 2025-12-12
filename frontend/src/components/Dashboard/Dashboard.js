import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  const handleSubjectClick = (subject) => {
    navigate(`/games?subject=${subject}`);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your dashboard... 🎮</div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>Error loading dashboard</div>;
  }

  const subjects = ['math', 'physics', 'chemistry', 'language', 'coding'];
  const subjectIcons = {
    math: '🔢',
    physics: '⚛️',
    chemistry: '🧪',
    language: '📚',
    coding: '💻',
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🌟 Welcome, {user?.username}! 🌟</h1>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* User Stats */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <div className="stat-value">{dashboardData.user.points}</div>
              <div className="stat-label">Points</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <div className="stat-value">Level {dashboardData.user.level}</div>
              <div className="stat-label">Your Level</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎖️</div>
            <div className="stat-info">
              <div className="stat-value">{dashboardData.user.achievements?.length || 0}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>
        </div>

        {/* Subjects Section - Only show to children */}
        {user?.role === 'child' && (
          <section className="subjects-section">
            <h2>📖 Learn by Subject</h2>
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <div
                  key={subject}
                  className="subject-card"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <div className="subject-icon">{subjectIcons[subject]}</div>
                  <div className="subject-name">{subject.charAt(0).toUpperCase() + subject.slice(1)}</div>
                  <div className="subject-count">
                    {dashboardData.gamesBySubject[subject]?.length || 0} games
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* View Games Section for Parents/Teachers */}
        {(user?.role === 'parent' || user?.role === 'teacher') && (
          <section className="subjects-section">
            <h2>📖 View Games by Subject</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              👁️ You can view games but cannot play them. Only children can play games.
            </p>
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <div
                  key={subject}
                  className="subject-card"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <div className="subject-icon">{subjectIcons[subject]}</div>
                  <div className="subject-name">{subject.charAt(0).toUpperCase() + subject.slice(1)}</div>
                  <div className="subject-count">
                    {dashboardData.gamesBySubject[subject]?.length || 0} games
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Creative Activities */}
        <section className="creative-section">
          <h2>🎨 Creative Activities</h2>
          <div className="creative-card" onClick={() => navigate('/games?category=creative')}>
            <div className="creative-icon">✨</div>
            <div className="creative-info">
              <h3>Sandbox & Creative Play</h3>
              <p>Express your creativity and apply what you've learned!</p>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="leaderboard-section">
          <h2>🏅 Leaderboard</h2>
          <div className="leaderboard">
            {dashboardData.leaderboard?.slice(0, 10).map((player, index) => (
              <div key={index} className={`leaderboard-item ${player.username === user?.username ? 'current-user' : ''}`}>
                <div className="rank">#{index + 1}</div>
                <div className="player-name">{player.username}</div>
                <div className="player-points">{player.points} pts</div>
                <div className="player-level">Lv.{player.level}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Sessions */}
        {dashboardData.recentSessions?.length > 0 && (
          <section className="recent-section">
            <h2>🕐 Recent Games</h2>
            <div className="recent-games">
              {dashboardData.recentSessions.map((session) => (
                <div key={session._id} className="recent-game-card">
                  <div className="game-title">{session.gameId?.title}</div>
                  <div className="game-subject">{session.gameId?.subject}</div>
                  <div className="game-score">Score: {session.score || 0}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="quick-actions">
          {user?.role === 'child' && (
            <>
              <button onClick={() => navigate('/games')} className="action-btn">
                🎮 Browse All Games
              </button>
              <button onClick={() => navigate('/achievements')} className="action-btn">
                🏆 View Achievements
              </button>
            </>
          )}
          {(user?.role === 'parent' || user?.role === 'teacher') && (
            <>
              <button onClick={() => navigate('/games')} className="action-btn">
                👁️ View Games
              </button>
              <button onClick={() => navigate('/monitoring')} className="action-btn">
                📊 Monitoring Dashboard
              </button>
            </>
          )}
          {(user?.role === 'parent' || user?.role === 'teacher' || user?.role === 'admin') && (
            <button onClick={() => navigate('/profile')} className="action-btn">
              👤 My Profile
            </button>
          )}
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="action-btn">
              ⚙️ Admin Panel
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

