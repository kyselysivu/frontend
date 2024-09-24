import React, { useEffect, useState } from 'react';
import "./leaderboard.css";
import LeaderboardElement from '../components/leaderboardelement.jsx'; 

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/leaderboard')
            .then(response => response.json())
            .then(data => setLeaderboardData(data.leaderboard))
            .catch(error => console.error('Error fetching leaderboard data:', error));
    }, []);

    return (
        <div>
            <nav></nav>
            <h1 className='otsikko'>Kunniataulukko</h1>
            {leaderboardData.map((item, index) => (
                <LeaderboardElement 
                    key={index}
                    points={item.score}
                    team={item.group_name}
                    position={index + 1}
                />
            ))}
        </div>
    );
}

export default Leaderboard;