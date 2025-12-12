import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { monitoringAPI } from '../../services/api';
import './Monitoring.css';

const Monitoring = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'parent' || user?.role === 'teacher' || user?.role === 'admin') {
      loadChildren();
    } else {
      // Children can view their own monitoring data
      loadMonitoringData(user?._id);
    }
  }, [user]);

  const loadChildren = async () => {
    try {
      const response = await monitoringAPI.getChildren();
      setChildren(response.data.data.children);
      if (response.data.data.children.length > 0) {
        setSelectedChild(response.data.data.children[0]._id);
        loadMonitoringData(response.data.data.children[0]._id);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonitoringData = async (userId) => {
    try {
      setLoading(true);
      const response = await monitoringAPI.getMonitoringData(userId);
      setMonitoringData(response.data.data);
    } catch (error) {
      console.error('Error loading monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChildChange = (childId) => {
    setSelectedChild(childId);
    loadMonitoringData(childId);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return <div className="loading">Loading monitoring data... 📊</div>;
  }

  return (
    <div className="monitoring-container">
      <div className="monitoring-header">
        <h1>📊 Monitoring Dashboard</h1>
        {(user?.role === 'parent' || user?.role === 'teacher' || user?.role === 'admin') && children.length > 0 && (
          <select
            value={selectedChild}
            onChange={(e) => handleChildChange(e.target.value)}
            className="child-selector"
          >
            {children.map((child) => (
              <option key={child._id} value={child._id}>
                {child.username} (Age: {child.age || 'N/A'})
              </option>
            ))}
          </select>
        )}
        {user?.role === 'parent' && children.length === 0 && (
          <div className="no-children-notice">
            <p>No children linked to your account. Children need to register with your user ID as their parent ID.</p>
          </div>
        )}
      </div>

      {monitoringData && (
        <div className="monitoring-content">
          {/* Screen Time Section */}
          <section className="monitoring-section">
            <h2>⏱️ Screen Time</h2>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label">Total Time</div>
                <div className="stat-value">
                  {formatTime(monitoringData.screenTime?.total || 0)}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Average per Session</div>
                <div className="stat-value">
                  {formatTime(monitoringData.sessions?.averageDuration || 0)}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Total Sessions</div>
                <div className="stat-value">{monitoringData.sessions?.count || 0}</div>
              </div>
            </div>

            <h3>Time by Subject</h3>
            <div className="subject-time-grid">
              {Object.entries(monitoringData.screenTime?.bySubject || {}).map(
                ([subject, time]) => (
                  <div key={subject} className="subject-time-card">
                    <div className="subject-name">{subject}</div>
                    <div className="subject-time">{formatTime(time)}</div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Content Accessed */}
          <section className="monitoring-section">
            <h2>📚 Content Accessed</h2>
            <div className="content-list">
              {monitoringData.contentAccessed?.map((content, index) => (
                <div key={index} className="content-item">
                  <div className="content-title">{content.title || 'Game'}</div>
                  <div className="content-meta">
                    <span>Subject: {content.subject}</span>
                    <span>Accessed: {content.timesAccessed} times</span>
                    <span>Time: {formatTime(content.totalTime)}</span>
                  </div>
                </div>
              ))}
              {(!monitoringData.contentAccessed || monitoringData.contentAccessed.length === 0) && (
                <div className="no-data">No content accessed yet</div>
              )}
            </div>
          </section>

          {/* Behavioral Patterns */}
          <section className="monitoring-section">
            <h2>📈 Behavioral Patterns</h2>
            <div className="patterns-grid">
              <div className="pattern-card">
                <h3>Peak Hours</h3>
                <div className="peak-hours">
                  {monitoringData.behavioralPatterns?.peakHours?.slice(0, 5).map((item, index) => (
                    <div key={index} className="peak-hour-item">
                      <span>{item.hour}:00</span>
                      <span>{item.activity} sessions</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pattern-card">
                <h3>Preferred Subjects</h3>
                <div className="preferred-subjects">
                  {monitoringData.behavioralPatterns?.preferredSubjects?.map((item, index) => (
                    <div key={index} className="subject-preference">
                      <div className="subject-label">{item.subject}</div>
                      <div className="subject-bar">
                        <div
                          className="subject-bar-fill"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="subject-percentage">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Progress */}
          <section className="monitoring-section">
            <h2>🎯 Progress</h2>
            <div className="progress-grid">
              <div className="progress-item">
                <div className="progress-icon">🎮</div>
                <div className="progress-value">{monitoringData.progress?.gamesCompleted || 0}</div>
                <div className="progress-label">Games Completed</div>
              </div>
              <div className="progress-item">
                <div className="progress-icon">⭐</div>
                <div className="progress-value">{monitoringData.progress?.pointsEarned || 0}</div>
                <div className="progress-label">Points Earned</div>
              </div>
              <div className="progress-item">
                <div className="progress-icon">🏆</div>
                <div className="progress-value">{monitoringData.progress?.achievementsUnlocked || 0}</div>
                <div className="progress-label">Achievements</div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Monitoring;

