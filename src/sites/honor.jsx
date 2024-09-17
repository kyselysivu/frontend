import React, { useEffect, useState } from 'react';
import "./honor.css";
import LeaderboardElement from '../components/leaderboardelement.jsx'; 

function Honor() {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        // Replace with your backend API endpoint
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
                    points={item.points} 
                    team={item.team} 
                    position={index + 1} // Use the position provided by the API
                />
            ))}
        </div>
    );
}

export default Honor;