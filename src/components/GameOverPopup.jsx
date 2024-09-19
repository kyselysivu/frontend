import React from 'react';
import './GameOverPopup.css';
import { useNavigate } from 'react-router-dom';

export default function GameOverPopup({ isVisible, onClose, title, score, timeElapsed }) {
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
        <p>Pisteet: {score}</p>
        {timeElapsed && <p>Aika: {timeElapsed}</p>}
        <button onClick={handleClose}>Sulje</button>
      </div>
    </div>
  );
}