import React from 'react';
import "./home.css"
import { useState } from 'react';

function Home() {
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
                </div>
                <div className="container">
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        placeholder="Ryhmän nimi"
                    />
                    <button className="play-button" onClick={handleButtonClick}>Pelaa</button>
                </div>
            </div>
        </div>
    );
}

export default Home;