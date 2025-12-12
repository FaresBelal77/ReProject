import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'child',
    age: '',
    parentId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare submit data
    const submitData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    };

    // Add age for children (required)
    if (formData.role === 'child') {
      if (!formData.age || formData.age === '') {
        setError('Age is required for children (must be between 5 and 18)');
        setLoading(false);
        return;
      }
      submitData.age = parseInt(formData.age);
      if (isNaN(submitData.age) || submitData.age < 5 || submitData.age > 18) {
        setError('Age must be a number between 5 and 18');
        setLoading(false);
        return;
      }
      
      // Add parentId if provided
      if (formData.parentId && formData.parentId.trim() !== '') {
        submitData.parentId = formData.parentId.trim();
      }
    }

    const result = await register(submitData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>🌟 Join the Adventure!</h1>
          <p>Create your account and start learning!</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>👤 Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a fun username"
            />
          </div>
          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="At least 6 characters"
            />
          </div>
          <div className="form-group">
            <label>👥 I am a...</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="child">Child/Student</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          {formData.role === 'child' && (
            <>
              <div className="form-group">
                <label>🎂 Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="5"
                  max="18"
                  placeholder="Your age (5-18)"
                />
              </div>
              <div className="form-group">
                <label>👨‍👩‍👧 Parent ID (Optional)</label>
                <input
                  type="text"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  placeholder="Parent's user ID"
                />
              </div>
            </>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : '🎉 Start Learning!'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here!</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

