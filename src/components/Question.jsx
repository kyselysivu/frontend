import React, { useState } from 'react';
import './Question.component.css';

export const Question = ({ index, question, className }) => {
    const [toggled, setToggled] = useState(false);

    // If 'toggled', add the 'question-toggled' classname to the classname
    return (
        <div className={`question ${toggled ? 'question-toggled' : ''} ${className}`} onClick={() => {
            setToggled(!toggled)
        }}>
            <div className='question-data'>
                <p>{index}.</p>
                <p>{question}</p>
            </div>
        </div>
    )
}