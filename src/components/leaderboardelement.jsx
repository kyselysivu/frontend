import React from 'react';
import './leaderboardelement.css';
import timer from "../components/timer.svg"
import diamond from "../components/diamond.svg"

const LeaderboardElement = (props) => {
  let className = 'leaderboard-element';
  if (props.position === 1) {
    className += ' first-position';
  } else if (props.position === 2) {
    className += ' second-position';
  } else if (props.position === 3) {
    className += ' third-position';
  } else if (props.position >= 4) {
    className += ' high-position';
  }

  return (
    <div className={className}>
      <h2 className="points"><img src={diamond} alt=''/>{props.points}</h2>
      <p className="time"><img src={timer} alt=''/>{props.time}</p>
      <p className="team">{props.team}</p>
    </div>
  );
};

export default LeaderboardElement;