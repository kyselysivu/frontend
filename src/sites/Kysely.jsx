import React, { useEffect, useState } from 'react';
import "./Kysely.css";
import timer from "../components/timer.svg";
import diamond from "../components/diamond.svg";
import { Question } from '../components/Question';
import GameOverPopup from '../components/GameOverPopup.jsx';

export default function Kysely() {
    const [questionCount, setQuestionCount] = useState(null);
    const [questionIds, setQuestionIds] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentQuestionData, setCurrentQuestionData] = useState({});
    const [currentQuestionLoaded, setCurrentQuestionLoaded] = useState(false);
    const [currentQuestionOptions, setCurrentQuestionOptions] = useState([]);
    const [currentQuestionOptionsLoaded, setCurrentQuestionOptionsLoaded] = useState(false);
    const [correctOptions, setCorrectOptions] = useState([]);
    const [incorrectOptions, setIncorrectOptions] = useState([]);
    const [submitButtonVisible, setSubmitButtonVisible] = useState(true);
    const [buttonContents, setButtonContents] = useState("Vastaa");
    const [shouldShowCorrectAnswer, setShouldShowCorrectAnswer] = useState(false);
    const [buttonShouldGoToNextQuestion, setButtonShouldGoToNextQuestion] = useState(false);
    const [shouldShowSubtext, setShouldShowSubtext] = useState(false);
    const [subtextContents, setSubtextContents] = useState("");
    const [timeLeft, setTimeLeft] = useState(60 * 12);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [imageSrc, setImageSrc] = useState("");
    const [additionalHtml, setAdditionalHtml] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameOverTitle, setGameOverTitle] = useState("");
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [timerId, setTimerId] = useState(null);
    const [totalPoints, setTotalPoints] = useState(0);
    const [isAnswerSelected, setIsAnswerSelected] = useState(false);

    const initialTime = 60 * 12; // Initial time in seconds

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    function getOptionsForCurrentQuestion() {
        return currentQuestionOptions;
    }

    function getTitleForCurrentQuestion() {
        console.debug("Requested title for current question, returning", currentQuestionData.question_title);
        return currentQuestionData.question_title;
    }

    function isAnswerCorrect(answerId) {
        return correctOptions.includes(answerId);
    }

    useEffect(() => {
        fetch("http://localhost:3000/api/start", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ team_name: document.cookie.split("=")[1] }),
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Received game metadata:", data);
                setQuestionCount(data.questions.length);
                setQuestionIds(data.questions);
                setCurrentQuestion(data.questions[0]);
                setTimeLeft(data.time_limit);
            })
            .catch((error) => console.error("Error fetching questions:", error));
    }, []);

    useEffect(() => {
        setImageSrc("");
        if (currentQuestion === undefined || currentQuestion === null) return;
        fetch(`http://localhost:3000/api/questions/${currentQuestion}`)
            .then((response) => response.json())
            .then((data) => {
                setCurrentQuestionData(data);
                setCurrentQuestionLoaded(true);
                setCurrentQuestionOptions(data.answers);
                setCurrentQuestionOptionsLoaded(true);
                if (data.image_src) {
                    const img = new Image();
                    img.src = data.image_src;
                    img.onload = () => setImageSrc(data.image_src);
                } else {
                    setImageSrc("");
                }

                if (data.additional_html) {
                    setAdditionalHtml(data.additional_html);
                } else {
                    setAdditionalHtml("");
                }
                console.log("Fetched question data for question", currentQuestion, ":", data);
            })
            .catch((error) => console.error("Error fetching answers:", error));
    }, [currentQuestion]);

    useEffect(() => {
        const parsedCookie = document.cookie.split("=")[1]; // ottaa nimen cookiesta
        if (timeLeft <= 0) {
            setGameOverTitle("ryhmän: " + parsedCookie + " Aika loppui!");
            setIsGameOver(true);
            fetchScore();
            return;
        }

        const id = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        setTimerId(id);

        return () => clearInterval(id);
    }, [timeLeft]);

    const fetchScore = () => {
        fetch("http://localhost:3000/api/end", {
            method: 'POST',
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Received score:", data);
                setScore(data.score);
            })
            .catch((error) => console.error("Error fetching score:", error));
    };

    const handleFinishQuiz = () => {
        setGameOverTitle("Onneksi olkoon!");
        setTimeElapsed(initialTime - timeLeft);
        setIsGameOver(true);
        clearInterval(timerId); // Stop the timer
        fetchScore();
    };

    return (
        <div>
            <div className="navbar">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${(currentQuestionIndex / questionCount) * 100}%` }}
                ></div>
                <h1 id='kysymysnum'>Kysymys {currentQuestionIndex + 1}/{questionCount}</h1>
            </div>
            <div className="header" style={{ transition: 'opacity 0.5s ease', opacity: currentQuestionLoaded ? 1 : 0 }}>{
                (currentQuestionLoaded) ? getTitleForCurrentQuestion() : "Ladataan..."
            }
            </div>
            {imageSrc ? (
                <div className='question_image'>
                    <img src={imageSrc} alt="Ladataan kuvaa..." />
                </div>
            ) : (
                ""
            )}
            {additionalHtml ? (
                <div className='question_additional_html' dangerouslySetInnerHTML={{ __html: additionalHtml }} />
            ) : (
                ""
            )}
            <div className="timer" style={{ gap: '10px' }}>
                <img src={timer} alt='timer' />
                <p>{formatTime(timeLeft)}</p>
                <img src={diamond} alt='points' />
                <p>{totalPoints}</p>
            </div>
            <div className="questions">
                <div className="questions-container"
                    style={{ transition: 'opacity 0.5s ease', opacity: currentQuestionOptionsLoaded ? 1 : 0 }}>
                    {
                        (currentQuestionOptionsLoaded) ? getOptionsForCurrentQuestion().map((option, index) => {
                            return <Question
                                key={index}
                                index={index + 1}
                                question={option.answer}
                                active={selectedAnswers.includes(option.id)}
                                setActiveCallback={(active) => {
                                    if (active) {
                                        setSelectedAnswers([...selectedAnswers, option.id]);
                                        setIsAnswerSelected(true);
                                    } else {
                                        const newSelectedAnswers = selectedAnswers.filter((id) => id !== option.id);
                                        setSelectedAnswers(newSelectedAnswers);
                                        setIsAnswerSelected(newSelectedAnswers.length > 0);
                                    }
                                }}
                                className={shouldShowCorrectAnswer ? (isAnswerCorrect(option.id) ? 'question-correct' : 'question-incorrect') : ''} />
                        }) : "Loading..."
                    }
                </div>
                <button
                    style={{
                        opacity: submitButtonVisible ? 1 : 0,
                        visibility: submitButtonVisible ? 'visible' : 'hidden',
                        transition: 'opacity 0.5s ease, visibility 0.5s ease',
                        justifyContent: 'center',
                        marginTop: '20px',
                        display: 'flex',
                    }}
                    id="quiz-submit-button"
                    className={`submit-button ${!isAnswerSelected ? 'disabled' : ''}`}
                    onClick={() => {
                        if (buttonShouldGoToNextQuestion) {
                            if (currentQuestionIndex >= questionIds.length - 1) {
                                handleFinishQuiz();
                            } else {
                                setShouldShowCorrectAnswer(false);
                                setCurrentQuestionIndex(currentQuestionIndex + 1);
                                setCurrentQuestion(questionIds[currentQuestionIndex + 1]);
                                setSelectedAnswers([]);
                                setShouldShowSubtext(false);
                                setButtonShouldGoToNextQuestion(false);
                                setIsAnswerSelected(false);
                                setButtonContents("Vastaa");
                            }
                        } else {
                            // Fade out the button
                            setSubmitButtonVisible(false);

                            setCorrectOptions([]);
                            setIncorrectOptions([]);

                            console.log("Submitting solutions to question", currentQuestion, ":", selectedAnswers);

                            fetch("http://localhost:3000/api/answer", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    question_id: currentQuestion,
                                    answers: selectedAnswers
                                }),
                                credentials: 'include'
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    console.log("Received answer data for question", currentQuestion, ":", data);
                                    setCorrectOptions(data.correct);
                                    setIncorrectOptions(data.incorrect);
                                    setTotalPoints(Math.round(data.total_points)); // Update total points and round to nearest integer

                                    console.log("Selected answers:", selectedAnswers);
                                    const getAmountOfIncorrectlyPlacedAnswers = () => {
                                        return data.incorrect.filter((incorrectOption) => selectedAnswers.includes(incorrectOption)).length;
                                    };

                                    const getAmountOfCorrectlyPlacedAnswers = () => {
                                        return data.correct.filter((correctOption) => selectedAnswers.includes(correctOption)).length;
                                    }

                                    setTimeout(() => {
                                        setShouldShowCorrectAnswer(true);

                                        let subtext = "Vastasit oikein " +
                                            getAmountOfCorrectlyPlacedAnswers() +
                                            "/" +
                                            data.correct.length +
                                            " vaihtoehtoon! ";
                                        // Check if user got any answers incorrect
                                        if (getAmountOfIncorrectlyPlacedAnswers() > 0) {
                                            subtext += (getAmountOfIncorrectlyPlacedAnswers()) + " valintaasi oli väärin :(";
                                        }

                                        setSubtextContents(subtext);
                                        setShouldShowSubtext(true);
                                    }, 1000);

                                    setTimeout(() => {
                                        setButtonContents("Seuraava");
                                        setButtonShouldGoToNextQuestion(true);
                                        setSubmitButtonVisible(true);
                                    }, 3000);
                                })
                                .catch((error) => console.error("Error submitting answers:", error));
                        }
                    }}
                    disabled={!isAnswerSelected}
                >
                    {buttonContents}
                </button>

            </div>
            <p style={{
                display: shouldShowSubtext ? 'flex' : 'none',
                justifyContent: 'center',
                marginTop: '20px',
                marginBottom: '100px',
            }}>{subtextContents}</p>
            <GameOverPopup
                isVisible={isGameOver}
                onClose={() => setIsGameOver(false)}
                title={gameOverTitle}
                score={score}
                timeElapsed={gameOverTitle !== "Aika loppui!" ? formatTime(timeElapsed) : null}
            />
        </div>
    );
}