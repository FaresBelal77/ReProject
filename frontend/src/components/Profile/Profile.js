import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div className="loading">Loading profile... 👤</div>;
  }

  const roleLabels = {
    child: 'Child/Student',
    parent: 'Parent',
    teacher: 'Teacher',
    admin: 'Administrator'
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-icon">
              {user.role === 'child' && '👶'}
              {user.role === 'parent' && '👨‍👩‍👧'}
              {user.role === 'teacher' && '👨‍🏫'}
              {user.role === 'admin' && '⚙️'}
            </div>
          </div>

          <div className="profile-info">
            <div className="info-section">
              <h2>Personal Information</h2>
              <div className="info-item">
                <div className="info-label">👤 Username</div>
                <div className="info-value">{user.username}</div>
              </div>
              <div className="info-item">
                <div className="info-label">📧 Email</div>
                <div className="info-value">{user.email}</div>
              </div>
              <div className="info-item">
                <div className="info-label">🆔 User ID</div>
                <div className="info-value">{user.id || user._id}</div>
              </div>
              <div className="info-item">
                <div className="info-label">👥 Role</div>
                <div className="info-value">
                  <span className={`role-badge role-${user.role}`}>
                    {roleLabels[user.role] || user.role}
                  </span>
                </div>
              </div>
              {user.age && (
                <div className="info-item">
                  <div className="info-label">🎂 Age</div>
                  <div className="info-value">{user.age}</div>
                </div>
              )}
            </div>

            {user.role === 'child' && (
              <div className="info-section">
                <h2>Progress Information</h2>
                <div className="info-item">
                  <div className="info-label">⭐ Points</div>
                  <div className="info-value">{user.points || 0}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">🏆 Level</div>
                  <div className="info-value">Level {user.level || 1}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">🎖️ Achievements</div>
                  <div className="info-value">{user.achievements?.length || 0} unlocked</div>
                </div>
              </div>
            )}

            {user.role === 'parent' && (
              <div className="info-section">
                <h2>Parent Information</h2>
                <div className="info-item">
                  <div className="info-label">👨‍👩‍👧 Parent Account</div>
                  <div className="info-value">You can monitor your children's progress</div>
                </div>
                <div className="info-item">
                  <div className="info-label">📊 Access</div>
                  <div className="info-value">View children's progress and leaderboard</div>
                </div>
              </div>
            )}

            {user.role === 'teacher' && (
              <div className="info-section">
                <h2>Teacher Information</h2>
                <div className="info-item">
                  <div className="info-label">👨‍🏫 Teacher Account</div>
                  <div className="info-value">You can monitor all students' progress</div>
                </div>
                <div className="info-item">
                  <div className="info-label">📊 Access</div>
                  <div className="info-value">View all students' progress and leaderboard</div>
                </div>
              </div>
            )}

            {user.role === 'admin' && (
              <div className="info-section">
                <h2>Administrator Information</h2>
                <div className="info-item">
                  <div className="info-label">⚙️ Admin Account</div>
                  <div className="info-value">Full system access</div>
                </div>
                <div className="info-item">
                  <div className="info-label">📊 Access</div>
                  <div className="info-value">Manage games, users, and system settings</div>
                </div>
              </div>
            )}

            <div className="info-section">
              <h2>Account Information</h2>
              <div className="info-item">
                <div className="info-label">📅 Account Created</div>
                <div className="info-value">
                  {user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </div>
              </div>
              {user.lastLogin && (
                <div className="info-item">
                  <div className="info-label">🕐 Last Login</div>
                  <div className="info-value">
                    {new Date(user.lastLogin).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

