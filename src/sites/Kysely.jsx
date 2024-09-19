import React, { useEffect, useState } from 'react';
import "./Kysely.css";
import timer from "../components/timer.svg";
import { Question } from '../components/Question';
import GameOverPopup from '../components/GameOverPopup.jsx';

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
  const [timeLeft, setTimeLeft] = useState(60 * 12);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [imageSrc, setImageSrc] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverTitle, setGameOverTitle] = useState("");
  const [score, setScore] = useState(0);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  function getCorrectAnswers() {
    return allAnswers.options.filter(option => option.related_question === currentQuestion && option.is_correct == 1);
  }

  function getIncorrectlyAnsweredOptions() {
    return selectedAnswers.filter(answer => allAnswers.options.find(option => option.id === answer).is_correct == 0);
  }

  function getCorrectlyAnsweredOptions() {
    return selectedAnswers.filter(answer => allAnswers.options.find(option => option.id === answer).is_correct == 1);
  }

  function getOptionsForCurrentQuestion() {
    return allAnswers.options.filter(option => option.related_question === currentQuestion);
  }

  function getTitleForCurrentQuestion() {
    return allQuestions.questions.find(question => question.id === currentQuestion).question_title;
  }

  function getImageSrcForCurrentQuestion() {
    if (!allQuestions.questions) return "";
    const currentQuestionData = allQuestions.questions.find(question => question.id === currentQuestion);
    return currentQuestionData ? currentQuestionData.image_src : "";
  }

  // Fetch questions once when component mounts
  useEffect(() => {
    fetch("http://localhost:3000/api/questions")
      .then((response) => response.json())
      .then((data) => {
        setAllQuestions(data);
        console.log(data);
        setQuestionsLoaded(true);

        // Preload the image for the current question
        const imageSrc = getImageSrcForCurrentQuestion();
        if (imageSrc) {
          const img = new Image();
          img.src = imageSrc;
          img.onload = () => setImageSrc(imageSrc);
        }
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

          // Preload the image for the current question
          const imageSrc = getImageSrcForCurrentQuestion();
          if (imageSrc) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => setImageSrc(imageSrc);
          }
        })
        .catch((error) => console.error("Error fetching answers:", error));
    }
  }, [currentQuestion, questionsLoaded]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOverTitle("Aika loppui!");
      setIsGameOver(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    // Calculate the score whenever selectedAnswers changes
    const correctAnswers = getCorrectlyAnsweredOptions().length;
    setScore(correctAnswers);
  }, [selectedAnswers]);

  return (
    <div>
      <div className="navbar"></div>
      <div className="header" style={{ transition: 'opacity 0.5s ease', opacity: questionsLoaded ? 1 : 0 }}>{
        (questionsLoaded && answersLoaded) ? getTitleForCurrentQuestion() : "Ladataan..."
      }
      </div>
      <div className="timer" style={{ gap: '10px' }}>
        <img src={timer} alt='timer'/>
        <p>{formatTime(timeLeft)}</p>
      </div>
      {imageSrc ? (
        <div className='question_image'>
          <img src={imageSrc} alt="image" />
        </div>
      ) : (
        ""
      )}
      <div className="questions">
        <div className="questions-container" style={{ transition: 'opacity 0.5s ease', opacity: questionsLoaded ? 1 : 0 }}>
          {
            (questionsLoaded && answersLoaded) ? getOptionsForCurrentQuestion().map((option, index) => {
              return <Question 
                key={index} 
                index={index + 1} 
                question={option.answer_title} 
                active={selectedAnswers.includes(option.id)}
                setActiveCallback={(active) => {
                  if (active) {
                    setSelectedAnswers([...selectedAnswers, option.id]);
                  } else {
                    setSelectedAnswers(selectedAnswers.filter((id) => id !== option.id));
                  }
                }}
                className={shouldShowCorrectAnswer ? (option.is_correct == 1 ? 'question-correct' : 'question-incorrect') : ''} />
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
          onClick={() => {
            if (buttonShouldGoToNextQuestion) {
              if (currentQuestion >= allQuestions.questions.length) {
                setGameOverTitle("Onneksi olkoon!");
                setIsGameOver(true);
              } else {
                setShouldShowCorrectAnswer(false);
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswers([]);
                setShouldShowSubtext(false);
                setButtonShouldGoToNextQuestion(false);
              }
            } else {
              // Fade out the button
              setSubmitButtonVisible(false);
              
              setTimeout(() => {
                setShouldShowCorrectAnswer(true);

                let subtext = "Vastasit oikein " +
                  getCorrectlyAnsweredOptions().length +
                  "/" +
                  getCorrectAnswers().length + 
                  " vaihtoehtoon! ";

                // Check if user got any answers incorrect
                if (getIncorrectlyAnsweredOptions().length > 0) {
                  subtext += (getIncorrectlyAnsweredOptions().length) + " valintaasi oli väärin :(";
                }

                setSubtextContents(subtext);
                setShouldShowSubtext(true);
              }, 1000);

              setTimeout(() => {
                if (currentQuestion >= allQuestions.questions.length) {
                  setButtonContents("Valmis!");
                } else {
                  setButtonContents("Seuraava");
                }

                setButtonShouldGoToNextQuestion(true);
                setSubmitButtonVisible(true);
              }, 3000);
            }
          }}
          disabled={!submitButtonVisible}
        >
          {buttonContents}
        </button>
      </div>
      <GameOverPopup 
        isVisible={isGameOver} 
        onClose={() => setIsGameOver(false)} 
        title={gameOverTitle}
        score={score}
      />
    </div>
  );
}