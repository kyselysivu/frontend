import React from 'react';
import "./home.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const ToLeaderBoard = () => {
      navigate('/leaderboard');
    };

    const [inputValue, setInputValue] = useState('');

    const handleButtonClick = () => {
      console.log(inputValue); // Replace this with your desired action
    };
    return (
        <div>
            <nav></nav>
            <div className="flex-container">
                <div className="text-container"> 
                    <h1 className="h1">Kyselysivu</h1>
                    <p className="p">
                        Vastaa oikein sarjaan monivalintakysymyksiä ryhmäsi kanssa.
                        Sinulla on yhteensä 12 minuuttia aikaa.
                        Parhaat tulokset pääsevät kunniataululle!
                    </p>
                    <button className='kunnia' onClick={ToLeaderBoard}>Kunniataulukko</button>
                </div>
                <div className="container">
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        placeholder="Ryhmän nimi"
                    />
                    <button className="play-button" onClick={handleButtonClick}>Pelaa</button>
                    <a href="/leaderboard" className='kunnialinkki'>Kunniataulukko</a>
                </div>
            </div>
        </div>
    );
}

export default Home;