import React from 'react';
import './GameOverPopup.css';
import { useNavigate } from 'react-router-dom';

export default function GameOverPopup({ isVisible, onClose, title, score }) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleClose = () => {
    onClose();
    navigate('/leaderboard');
  };

  return (
    <div className="gameover-popup">
      <div className="gameover-popup-content">
        <h2>{title}</h2>
        <p>Your score: {score}</p>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}