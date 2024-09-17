import React from 'react';

const LeaderboardElement = (props) => {
  return (
    <div className="leaderboard-element">
      {/* Add your component content here */}
      <h2>{props.points}</h2>
      <p>{props.time}</p>
      <p>{props.team}</p>
    </div>
  );
};

export default LeaderboardElement;