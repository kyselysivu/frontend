import React from 'react';
import "./honor.css"
import LeaderboardElement from '../components/leaderboardelement.jsx'; 
function Honor() {
    return (
        <div>
            <nav></nav>
            <h1>Kunniataulukko</h1>
            <LeaderboardElement points="12123" time="1m 12s" team="Team 1" position="1"/>
        </div>
    );
}

export default Honor;