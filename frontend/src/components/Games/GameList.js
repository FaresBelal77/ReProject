import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gamesAPI } from '../../services/api';
import './Games.css';

const GameList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const subject = searchParams.get('subject');
  const category = searchParams.get('category');
  
  // Check if user can play games (only children can play)
  const canPlayGames = user?.role === 'child';

  useEffect(() => {
    loadGames();
  }, [subject, category]);

  const loadGames = async () => {
    try {
      const params = {};
      if (subject) params.subject = subject;
      if (category) params.category = category;
      
      const response = await gamesAPI.getAllGames(params);
      setGames(response.data.data.games);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (gameId) => {
    if (canPlayGames) {
      navigate(`/games/${gameId}`);
    } else {
      // Parents and teachers can view game details but not play
      navigate(`/games/${gameId}/view`);
    }
  };

  if (loading) {
    return <div className="loading">Loading games... 🎮</div>;
  }

  const subjectIcons = {
    math: '🔢',
    physics: '⚛️',
    chemistry: '🧪',
    language: '📚',
    coding: '💻',
    creative: '✨',
  };

  return (
    <div className="games-container">
      <div className="games-header">
        <h1>
          {subject ? `${subjectIcons[subject]} ${subject.charAt(0).toUpperCase() + subject.slice(1)} Games` :
           category ? `🎨 Creative Activities` :
           '🎮 All Games'}
        </h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
      </div>
      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game._id}
            className="game-card"
            onClick={() => handleGameClick(game._id)}
          >
            <div className="game-icon">{subjectIcons[game.subject] || '🎮'}</div>
            <div className="game-title">{game.title}</div>
            <div className="game-description">{game.description}</div>
            <div className="game-meta">
              <span className="game-difficulty">{game.difficulty}</span>
              <span className="game-points">⭐ {game.pointsReward} pts</span>
            </div>
            <div className="game-time">⏱️ {game.estimatedTime} min</div>
            {!canPlayGames && (
              <div className="game-view-only">👁️ View Only (Parents/Teachers cannot play)</div>
            )}
          </div>
        ))}
      </div>
      {games.length === 0 && (
        <div className="no-games">No games found. Check back later! 🎮</div>
      )}
    </div>
  );
};

export default GameList;

