import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { safetyAPI } from '../../services/api';
import './Safety.css';

const Safety = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSafetyData();
  }, [user]);

  const loadSafetyData = async () => {
    try {
      const userId = user?._id;
      const [alertsRes, statsRes] = await Promise.all([
        safetyAPI.getSafetyAlerts(userId),
        safetyAPI.getSafetyStatistics(userId),
      ]);
      setAlerts(alertsRes.data.data.alerts);
      setStatistics(statsRes.data.data);
    } catch (error) {
      console.error('Error loading safety data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (alertId, resolution) => {
    try {
      await safetyAPI.resolveAlert(alertId, resolution);
      loadSafetyData();
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Failed to resolve alert');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#dc3545';
      case 'high':
        return '#fd7e14';
      case 'medium':
        return '#ffc107';
      default:
        return '#28a745';
    }
  };

  if (loading) {
    return <div className="loading">Loading safety data... 🛡️</div>;
  }

  return (
    <div className="safety-container">
      <div className="safety-header">
        <h1>🛡️ Safety & Alerts</h1>
      </div>

      {statistics && (
        <div className="safety-stats">
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-value">{statistics.totalAlerts}</div>
            <div className="stat-label">Total Alerts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔴</div>
            <div className="stat-value">{statistics.activeAlerts}</div>
            <div className="stat-label">Active Alerts</div>
          </div>
        </div>
      )}

      <div className="alerts-section">
        <h2>Recent Alerts</h2>
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <div className="no-alerts-icon">✅</div>
            <h3>All Clear!</h3>
            <p>No safety alerts at this time. Keep up the great work!</p>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="alert-card"
                style={{ borderLeftColor: getSeverityColor(alert.severity) }}
              >
                <div className="alert-header">
                  <div className="alert-type">
                    <span className="alert-icon">
                      {alert.type === 'cyberbullying' && '🚫'}
                      {alert.type === 'explicit_content' && '🔞'}
                      {alert.type === 'inappropriate_language' && '💬'}
                      {alert.type === 'suspicious_activity' && '👁️'}
                    </span>
                    <span className="alert-type-text">{alert.type.replace('_', ' ')}</span>
                  </div>
                  <div
                    className="alert-severity"
                    style={{ backgroundColor: getSeverityColor(alert.severity) }}
                  >
                    {alert.severity}
                  </div>
                </div>

                <div className="alert-message">{alert.alertMessage}</div>
                <div className="alert-time">
                  Detected: {new Date(alert.detectedAt).toLocaleString()}
                </div>

                {alert.educationalGuidance && (
                  <div className="educational-guidance">
                    <h4>📚 Educational Guidance</h4>
                    <div className="guidance-title">{alert.educationalGuidance.title}</div>
                    <div className="guidance-content">{alert.educationalGuidance.content}</div>
                    {alert.educationalGuidance.resources && (
                      <div className="guidance-resources">
                        <strong>Resources:</strong>
                        <ul>
                          {alert.educationalGuidance.resources.map((resource, index) => (
                            <li key={index}>
                              <a href={resource} target="_blank" rel="noopener noreferrer">
                                {resource}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="alert-status">
                  Status: <span className={`status-badge status-${alert.status}`}>{alert.status}</span>
                </div>

                {(user?.role === 'parent' || user?.role === 'teacher' || user?.role === 'admin') &&
                  alert.status === 'active' && (
                    <div className="alert-actions">
                      <button
                        onClick={() => handleResolve(alert._id, 'resolved')}
                        className="btn-resolve"
                      >
                        Mark as Resolved
                      </button>
                      <button
                        onClick={() => handleResolve(alert._id, 'false_positive')}
                        className="btn-false-positive"
                      >
                        Mark as False Positive
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Safety;

