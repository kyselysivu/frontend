import React, { useEffect, useState } from 'react';
import "./leaderboard.css";
import LeaderboardElement from '../components/leaderboardelement.jsx'; 

function Leaderboard() {
    function msToTime(ms) {
        // Calculate time components
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
    
        // Adjust remaining seconds and minutes after division
        seconds = seconds % 60;
        minutes = minutes % 60;
    
        let timeStr = "";
    
        // Construct the human-readable time string
        if (hours > 0) {
            timeStr += hours + "h ";
        }
        if (minutes > 0) {
            timeStr += minutes + "m ";
        }
        if (seconds > 0) {
            timeStr += seconds + "s";
        }
    
        return timeStr.trim();
    }

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
                    points={Math.round(item.score)}
                    team={decodeURI(item.group_name)}
                    position={index + 1}
                    time={msToTime(item.time)}
                />
            ))}
        </div>
    );
}

export default Leaderboard;
