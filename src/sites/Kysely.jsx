import React from 'react';
import "../Kysely.css";
import timer from "../components/timer.svg"

export default function Kysely() {
  return (
    <div>
      <div className="navbar"></div>
      <div className="header">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis sem in risus pulvinar finibus?</div>
      <div className="timer"><img src={timer}/><p>1m 50s</p></div>
        <div className="questions">
          <div className="question"><p>Integer pretium leo mollis</p></div>
          <div className="question"><p>Integer pretium leo mollis</p></div>
          <div className="question"><p>Integer pretium leo mollis</p></div>
          <div className="question"><p>Integer pretium leo mollis</p></div>
          <div className="question"><p>Integer pretium leo mollis</p></div>
          <div className="question"><p>Integer pretium leo mollis</p></div>
        </div>
    </div>
  );
};