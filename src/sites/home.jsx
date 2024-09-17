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
            <div class="flex-container">
                <div class="text-container"> 
                    <h1>Kyselysivu</h1>
                    <p>
                        Vastaa oikein sarjaan monivalintakysymyksiä ryhmäsi kanssa.
                        Sinulla on yhteensä 12 minuuttia aikaa.
                        Parhaat tulokset pääsevät kunniataululle!
                    </p>
                </div>
                <div class="container">
                    <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Ryhmän nimi"
                    />
                    <button onClick={handleButtonClick}>Pelaa</button>
                </div>
            </div>
        </div>
    );
}

export default Home;