import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gamesAPI } from '../../services/api';
import './Games.css';

const GamePlay = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [session, setSession] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Check if user can play games (only children can play)
  const canPlayGames = user?.role === 'child';

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    try {
      const response = await gamesAPI.getGame(gameId);
      setGame(response.data.data.game);
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = async () => {
    if (!canPlayGames) {
      alert('Only children can play games. Parents and teachers can view game details but cannot play.');
      return;
    }
    
    try {
      const response = await gamesAPI.startGame(gameId);
      setSession(response.data.data.session);
      setGameStarted(true);
    } catch (error) {
      console.error('Error starting game:', error);
      const errorMessage = error.response?.data?.message || 'Failed to start game. Please try again.';
      alert(errorMessage);
      if (error.response?.status === 403) {
        // If forbidden, redirect to dashboard
        navigate('/dashboard');
      }
    }
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null) {
      alert('Please select an answer!');
      return;
    }

    try {
      const task = game.content.tasks[currentTaskIndex];
      const response = await gamesAPI.submitAnswer(session.id, {
        taskId: task._id || currentTaskIndex,
        userAnswer: selectedAnswer,
        timeSpent: 0,
      });

      setIsCorrect(response.data.data.isCorrect);
      setShowResult(true);

      // Move to next question after 2 seconds
      setTimeout(() => {
        if (currentTaskIndex < game.content.tasks.length - 1) {
          setCurrentTaskIndex(currentTaskIndex + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          endGame();
        }
      }, 2000);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const endGame = async () => {
    try {
      await gamesAPI.endGame(session.id);
      alert('Game completed! Check your points!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading game... 🎮</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  if (!gameStarted) {
    return (
      <div className="game-play-container">
        <div className="game-intro">
          <h1>{game.title}</h1>
          <p className="game-description">{game.description}</p>
          <div className="game-info">
            <div>📚 Subject: {game.subject}</div>
            <div>⭐ Points: {game.pointsReward}</div>
            <div>⏱️ Time: {game.estimatedTime} min</div>
            <div>📝 Tasks: {game.content.tasks?.length || 0}</div>
          </div>
          {game.content.instructions && (
            <div className="game-instructions">
              <h3>Instructions:</h3>
              <p>{game.content.instructions}</p>
            </div>
          )}
          {canPlayGames ? (
            <>
              <button onClick={startGame} className="btn-start">
                🚀 Start Game!
              </button>
              <button onClick={() => navigate('/games')} className="btn-back">
                ← Back to Games
              </button>
            </>
          ) : (
            <>
              <div className="view-only-notice">
                <h3>👁️ View Only Mode</h3>
                <p>Parents and teachers can view game details but cannot play games. Only children can play games.</p>
              </div>
              <div className="game-preview">
                <h3>Game Preview - Questions:</h3>
                {game.content.tasks?.map((task, index) => (
                  <div key={index} className="preview-question">
                    <p><strong>Question {index + 1}:</strong> {task.question}</p>
                    <ul>
                      {task.options.map((option, optIndex) => (
                        <li key={optIndex}>
                          {option} {optIndex === task.correctAnswer && '✓ (Correct Answer)'}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/games')} className="btn-back">
                ← Back to Games
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const currentTask = game.content.tasks[currentTaskIndex];
  const progress = ((currentTaskIndex + 1) / game.content.tasks.length) * 100;

  return (
    <div className="game-play-container">
      <div className="game-header">
        <h2>{game.title}</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          Question {currentTaskIndex + 1} of {game.content.tasks.length}
        </div>
      </div>

      <div className="question-container">
        <div className="question-text">{currentTask.question}</div>
        
        {!showResult && (
          <div className="options-container">
            {currentTask.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => setSelectedAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {showResult && (
          <div className={`result ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-icon">{isCorrect ? '✅' : '❌'}</div>
            <div className="result-text">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            {currentTask.explanation && (
              <div className="explanation">{currentTask.explanation}</div>
            )}
          </div>
        )}

        {!showResult && (
          <button
            onClick={submitAnswer}
            className="btn-submit"
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </button>
        )}
      </div>
    </div>
  );
};

export default GamePlay;

