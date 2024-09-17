import React, { useState } from 'react';
import './Question.component.css';

export const Question = ({ index, question, className, active, setActiveCallback }) => {
    // If 'toggled', add the 'question-toggled' classname to the classname
    return (
        <div className={`question ${active ? 'question-toggled' : ''} ${className}`} onClick={() => {
            setActiveCallback(!active)
        }}>
            <div className='question-data'>
                <p>{index}.</p>
                <p>{question}</p>
            </div>
        </div>
    )
}