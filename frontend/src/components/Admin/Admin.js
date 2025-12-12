import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('games');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [gamesRes, usersRes] = await Promise.all([
        adminAPI.getAllGames(),
        adminAPI.getAllUsers()
      ]);
      setGames(gamesRes.data.data.games);
      setUsers(usersRes.data.data.users);
    } catch (error) {
      console.error('Error loading admin data:', error);
      alert('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGame = async (gameId) => {
    try {
      const response = await adminAPI.toggleGameStatus(gameId);
      setGames(games.map(game => 
        game._id === gameId ? response.data.data.game : game
      ));
      alert(`Game ${response.data.data.game.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      alert('Failed to toggle game status');
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }
    try {
      await adminAPI.deleteGame(gameId);
      setGames(games.filter(game => game._id !== gameId));
      alert('Game deleted successfully!');
    } catch (error) {
      alert('Failed to delete game');
    }
  };

  const subjectIcons = {
    math: '🔢',
    physics: '⚛️',
    chemistry: '🧪',
    language: '📚',
    coding: '💻',
    creative: '✨',
  };

  if (loading) {
    return <div className="loading">Loading admin panel... 🔧</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'games' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('games')}
        >
          🎮 Games Management
        </button>
        <button
          className={activeTab === 'users' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
      </div>

      {activeTab === 'games' && (
        <div className="admin-content">
          <div className="admin-actions">
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-create">
              {showCreateForm ? '❌ Cancel' : '➕ Create New Game'}
            </button>
            <button onClick={loadData} className="btn-refresh">
              🔄 Refresh
            </button>
          </div>

          {showCreateForm && (
            <GameForm
              onClose={() => {
                setShowCreateForm(false);
                setEditingGame(null);
              }}
              onSuccess={() => {
                loadData();
                setShowCreateForm(false);
              }}
            />
          )}

          {editingGame && !showCreateForm && (
            <GameForm
              game={editingGame}
              onClose={() => setEditingGame(null)}
              onSuccess={() => {
                loadData();
                setEditingGame(null);
              }}
            />
          )}

          <div className="games-list">
            <h2>All Games ({games.length})</h2>
            <div className="games-grid">
              {games.map((game) => (
                <div key={game._id} className={`game-admin-card ${!game.isActive ? 'inactive' : ''}`}>
                  <div className="game-admin-header">
                    <div className="game-admin-icon">{subjectIcons[game.subject] || '🎮'}</div>
                    <div className="game-admin-info">
                      <h3>{game.title}</h3>
                      <div className="game-admin-meta">
                        <span className="game-subject">{game.subject}</span>
                        <span className="game-difficulty">{game.difficulty}</span>
                        <span className={`game-status ${game.isActive ? 'active' : 'inactive'}`}>
                          {game.isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="game-admin-description">{game.description}</div>
                  <div className="game-admin-stats">
                    <span>⭐ {game.pointsReward} pts</span>
                    <span>⏱️ {game.estimatedTime} min</span>
                    <span>📝 {game.content?.tasks?.length || 0} tasks</span>
                  </div>
                  <div className="game-admin-actions">
                    <button
                      onClick={() => handleToggleGame(game._id)}
                      className={`btn-toggle ${game.isActive ? 'btn-deactivate' : 'btn-activate'}`}
                    >
                      {game.isActive ? '❌ Deactivate' : '✅ Activate'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingGame(game);
                        setShowCreateForm(false);
                      }}
                      className="btn-edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game._id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {games.length === 0 && (
              <div className="no-games">No games found. Create your first game! 🎮</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-content">
          <div className="users-list">
            <h2>All Users ({users.length})</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Age</th>
                    <th>Points</th>
                    <th>Level</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>{u.role}</span>
                      </td>
                      <td>{u.age || '-'}</td>
                      <td>{u.points || 0}</td>
                      <td>{u.level || 1}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Game Form Component
const GameForm = ({ game, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: game?.title || '',
    description: game?.description || '',
    subject: game?.subject || 'math',
    category: game?.category || 'serious',
    difficulty: game?.difficulty || 'easy',
    pointsReward: game?.pointsReward || 10,
    estimatedTime: game?.estimatedTime || 15,
    instructions: game?.content?.instructions || '',
    ageMin: game?.ageRange?.min || 5,
    ageMax: game?.ageRange?.max || 18,
  });
  const [tasks, setTasks] = useState(game?.content?.tasks || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const gameData = {
        ...formData,
        ageRange: { min: parseInt(formData.ageMin), max: parseInt(formData.ageMax) },
        content: {
          instructions: formData.instructions,
          tasks: tasks
        }
      };

      if (game) {
        await adminAPI.updateGame(game._id, gameData);
      } else {
        await adminAPI.createGame(gameData);
      }
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save game');
    } finally {
      setLoading(false);
    }
  };

  const addTask = () => {
    setTasks([...tasks, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]);
  };

  const updateTask = (index, field, value) => {
    const newTasks = [...tasks];
    if (field === 'option') {
      const [optionIndex, optionValue] = value;
      newTasks[index].options[optionIndex] = optionValue;
    } else {
      newTasks[index][field] = value;
    }
    setTasks(newTasks);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="game-form-overlay">
      <div className="game-form">
        <div className="game-form-header">
          <h2>{game ? '✏️ Edit Game' : '➕ Create New Game'}</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              >
                <option value="math">🔢 Math</option>
                <option value="physics">⚛️ Physics</option>
                <option value="chemistry">🧪 Chemistry</option>
                <option value="language">📚 Language</option>
                <option value="coding">💻 Coding</option>
                <option value="creative">✨ Creative</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="serious">Serious</option>
                <option value="creative">Creative</option>
                <option value="sandbox">Sandbox</option>
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label>Points Reward</label>
              <input
                type="number"
                value={formData.pointsReward}
                onChange={(e) => setFormData({ ...formData, pointsReward: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Estimated Time (min)</label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                min="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age Range: Min</label>
              <input
                type="number"
                value={formData.ageMin}
                onChange={(e) => setFormData({ ...formData, ageMin: parseInt(e.target.value) })}
                min="5"
                max="18"
              />
            </div>
            <div className="form-group">
              <label>Age Range: Max</label>
              <input
                type="number"
                value={formData.ageMax}
                onChange={(e) => setFormData({ ...formData, ageMax: parseInt(e.target.value) })}
                min="5"
                max="18"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows="2"
            />
          </div>

          <div className="tasks-section">
            <div className="tasks-header">
              <h3>Tasks/Questions</h3>
              <button type="button" onClick={addTask} className="btn-add-task">
                ➕ Add Task
              </button>
            </div>
            {tasks.map((task, index) => (
              <div key={index} className="task-item">
                <div className="task-header">
                  <h4>Task {index + 1}</h4>
                  <button type="button" onClick={() => removeTask(index)} className="btn-remove-task">
                    🗑️ Remove
                  </button>
                </div>
                <div className="form-group">
                  <label>Question</label>
                  <input
                    type="text"
                    value={task.question}
                    onChange={(e) => updateTask(index, 'question', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Options</label>
                  {task.options.map((option, optIndex) => (
                    <div key={optIndex} className="option-input">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={task.correctAnswer === optIndex}
                        onChange={() => updateTask(index, 'correctAnswer', optIndex)}
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateTask(index, 'option', [optIndex, e.target.value])}
                        placeholder={`Option ${optIndex + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label>Explanation</label>
                  <textarea
                    value={task.explanation}
                    onChange={(e) => updateTask(index, 'explanation', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="no-tasks">No tasks added yet. Click "Add Task" to create questions.</div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : game ? '💾 Update Game' : '💾 Create Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;

