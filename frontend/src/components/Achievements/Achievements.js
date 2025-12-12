import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import './Achievements.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const response = await dashboardAPI.getAchievements();
      setAchievements(response.data.data.achievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return '#ff6b6b';
      case 'epic':
        return '#9b59b6';
      case 'rare':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return <div className="loading">Loading achievements... 🏆</div>;
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>🏆 Achievements</h1>
        <div className="achievements-summary">
          <div className="summary-item">
            <span className="summary-value">{unlockedAchievements.length}</span>
            <span className="summary-label">Unlocked</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{achievements.length}</span>
            <span className="summary-label">Total</span>
          </div>
        </div>
      </div>

      <div className="achievements-content">
        {unlockedAchievements.length > 0 && (
          <section className="achievements-section">
            <h2>✅ Unlocked Achievements</h2>
            <div className="achievements-grid">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="achievement-card unlocked"
                  style={{ borderColor: getRarityColor(achievement.rarity) }}
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-title">{achievement.title}</div>
                  <div className="achievement-description">{achievement.description}</div>
                  <div
                    className="achievement-rarity"
                    style={{ color: getRarityColor(achievement.rarity) }}
                  >
                    {achievement.rarity}
                  </div>
                  <div className="achievement-points">+{achievement.pointsReward} points</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {lockedAchievements.length > 0 && (
          <section className="achievements-section">
            <h2>🔒 Locked Achievements</h2>
            <div className="achievements-grid">
              {lockedAchievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="achievement-card locked"
                  style={{ borderColor: getRarityColor(achievement.rarity) }}
                >
                  <div className="achievement-icon locked-icon">🔒</div>
                  <div className="achievement-title">{achievement.title}</div>
                  <div className="achievement-description">{achievement.description}</div>
                  <div className="achievement-requirement">
                    {achievement.requirement.type === 'points' && (
                      <>Earn {achievement.requirement.value} points</>
                    )}
                    {achievement.requirement.type === 'games_completed' && (
                      <>Complete {achievement.requirement.value} games</>
                    )}
                    {achievement.requirement.type === 'subject_mastery' && (
                      <>
                        Master {achievement.requirement.subject} ({achievement.requirement.value}{' '}
                        games)
                      </>
                    )}
                  </div>
                  <div
                    className="achievement-rarity"
                    style={{ color: getRarityColor(achievement.rarity) }}
                  >
                    {achievement.rarity}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Achievements;

