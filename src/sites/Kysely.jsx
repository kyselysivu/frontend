import React, { useEffect, useState } from 'react';
import "./Kysely.css";
import timer from "../components/timer.svg"
import { Question } from '../components/Question';

export default function Kysely() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [answersLoaded, setAnswersLoaded] = useState(false);
  const [submitButtonVisible, setSubmitButtonVisible] = useState(true);
  const [buttonContents, setButtonContents] = useState("Vastaa");
  const [shouldShowCorrectAnswer, setShouldShowCorrectAnswer] = useState(false);
  const [buttonShouldGoToNextQuestion, setButtonShouldGoToNextQuestion] = useState(false);
  const [shouldShowSubtext, setShouldShowSubtext] = useState(false);
  const [subtextContents, setSubtextContents] = useState("");
  const [timeLeft , setTimeLeft] = useState(60 * 12);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Fetch questions once when component mounts
  useEffect(() => {
    fetch("http://localhost:3000/api/questions")
      .then((response) => response.json())
      .then((data) => {
        setAllQuestions(data);
        console.log(data);
        setQuestionsLoaded(true);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  // Fetch answers whenever currentQuestion changes
  useEffect(() => {
    if (questionsLoaded) {
      fetch(`http://localhost:3000/api/options`, {
        method: 'POST', // Explicitly use POST method
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionId: currentQuestion })
      })
        .then((response) => response.json())
        .then((data) => {
          setAllAnswers(data);
          console.log(data);
          setAnswersLoaded(true);
        })
        .catch((error) => console.error("Error fetching answers:", error));
    }
  }, [currentQuestion, questionsLoaded]);

  useEffect(() => {
    // Exit early if the timer has reached zero
    if (timeLeft <= 0) return;

    // Set an interval to decrease the timer every second
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup the interval on component unmount or when timeLeft changes
    return () => clearInterval(timerId);
  }, [timeLeft]);

  return (
    <div>
      <div className="navbar"></div>
      <div className="header" style={{ transition: 'opacity 0.5s ease', opacity: questionsLoaded ? 1 : 0 }}>{
        (questionsLoaded && answersLoaded) ? allQuestions.questions.find(question => question.id === currentQuestion).question_title : "Loading..."
      }
      </div>
      <div className="timer" style={{ gap: '10px' }}>
        <img src={timer} />
        <p>{formatTime(timeLeft)}</p>
      </div>
      <div className="questions">
        <div className="questions-container" style={{ transition: 'opacity 0.5s ease', opacity: questionsLoaded ? 1 : 0 }}>
          {
            (questionsLoaded && answersLoaded) ? allAnswers.options.filter(option => option.related_question === currentQuestion).map((option, index) => {
              return <Question key={index} index={index + 1} question={option.answer_title} className={shouldShowCorrectAnswer ? (option.is_correct == 1 ? 'question-correct' : 'question-incorrect') : ''} />
            }) : "Loading..."
          }
        </div>
      </div>
      <p style={{ display: shouldShowSubtext ? 'flex' : 'none', justifyContent: 'center', marginTop: '20px' }}>{subtextContents}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          style={{
            opacity: submitButtonVisible ? 1 : 0,
            visibility: submitButtonVisible ? 'visible' : 'hidden',
            transition: 'opacity 0.5s ease, visibility 0.5s ease',
            justifyContent: 'center',
            marginTop: '20px',
            display: 'flex',
          }}
          className='submit-button'
          onClick={(event) => {
            if (buttonShouldGoToNextQuestion) {
              setShouldShowCorrectAnswer(false);
              setCurrentQuestion(currentQuestion + 1);
              setShouldShowSubtext(false);
            } else {
              // Fade out the button
              setSubmitButtonVisible(false);
              
              setTimeout(() => {
                setShouldShowCorrectAnswer(true);
                setSubtextContents("fjauiehfoauehfoayegfoaeyghoar")
                setShouldShowSubtext(true);
              }, 500);

              setTimeout(() => {
                // Fade the button back in after 5 seconds
                setButtonContents("Seuraava");
                setButtonShouldGoToNextQuestion(true);
                setSubmitButtonVisible(true);
              }, 3000);

              // Uncomment if needed to go to the next question
              // setCurrentQuestion(currentQuestion + 1);
            }
          }}
          disabled={!submitButtonVisible}
        >
          {buttonContents}
        </button>
      </div>
    </div>
  );
};