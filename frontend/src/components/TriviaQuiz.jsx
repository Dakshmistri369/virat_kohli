import { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';

const TriviaQuiz = () => {
  const questions = [
    {
      question: "In which year did Virat Kohli captain the Indian Under-19 team to a World Cup victory?",
      options: ["2006", "2007", "2008", "2010"],
      answer: "2008",
      fact: "Virat Kohli led India to a U-19 World Cup win in Malaysia in 2008, defeating South Africa in the finals."
    },
    {
      question: "How many runs did Virat Kohli score in his historic 2016 IPL season?",
      options: ["848 Runs", "973 Runs", "930 Runs", "890 Runs"],
      answer: "973 Runs",
      fact: "He scored an unprecedented 973 runs in 16 matches, including 4 centuries, which remains the record for the most runs in a single IPL season."
    },
    {
      question: "Against which nation did Kohli score his historic 50th ODI century, breaking Sachin Tendulkar's record?",
      options: ["Australia", "Sri Lanka", "New Zealand", "Pakistan"],
      answer: "New Zealand",
      fact: "Kohli scored his 50th ODI century against New Zealand during the 2023 ICC Cricket World Cup Semi-Final at Wankhede Stadium."
    },
    {
      question: "What is Virat Kohli's highest individual score in Test Cricket?",
      options: ["183", "243", "254*", "235"],
      answer: "254*",
      fact: "His highest Test score is 254* against South Africa in Pune in October 2019."
    },
    {
      question: "What is Virat Kohli's jersey number for India and RCB?",
      options: ["10", "18", "7", "45"],
      answer: "18",
      fact: "Kohli has worn the number 18 jersey since his Under-19 days in memory of his father, Prem Kohli, who passed away on December 18, 2006."
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === questions[currentIdx].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
      if (score + (selectedOption === questions[currentIdx].answer ? 1 : 0) === questions.length) {
        // Trigger a huge celebration for a perfect score!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff1e27', '#ecb22e', '#ffffff']
        });
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="trivia-quiz-section">
      <div className="section-header">
        <span className="accent-bar" />
        <h2>THE KING'S TRIVIA CHALLENGE</h2>
        <p>Test your knowledge on the ultimate cricket champion</p>
      </div>

      <div className="quiz-container">
        {!quizFinished ? (
          <div className="quiz-card">
            <div className="quiz-progress-bar">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${((currentIdx) / questions.length) * 100}%` }} 
              />
            </div>
            
            <div className="quiz-meta">
              <span className="question-count">Question {currentIdx + 1} of {questions.length}</span>
              <span className="current-score">Score: {score}</span>
            </div>

            <h3 className="quiz-question">{questions[currentIdx].question}</h3>

            <div className="quiz-options">
              {questions[currentIdx].options.map((option) => {
                let btnClass = "";
                if (isAnswered) {
                  if (option === questions[currentIdx].answer) {
                    btnClass = "correct";
                  } else if (option === selectedOption) {
                    btnClass = "incorrect";
                  } else {
                    btnClass = "disabled";
                  }
                } else {
                  btnClass = selectedOption === option ? "selected" : "";
                }

                return (
                  <button
                    key={option}
                    className={`option-btn ${btnClass}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={isAnswered}
                  >
                    <span>{option}</span>
                    {isAnswered && option === questions[currentIdx].answer && <CheckCircle size={18} className="icon-right" />}
                    {isAnswered && option === selectedOption && option !== questions[currentIdx].answer && <XCircle size={18} className="icon-right" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="quiz-feedback fade-in">
                <p className="fact-text"><strong>Did you know?</strong> {questions[currentIdx].fact}</p>
                <button className="next-btn" onClick={handleNext}>
                  {currentIdx + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="quiz-result-card text-center fade-in">
            <Award size={64} className="result-award-icon gold-glow" />
            <h2>Quiz Completed!</h2>
            <div className="score-circle">
              <span className="score-num">{score}</span>
              <span className="score-den">/ {questions.length}</span>
            </div>
            <p className="result-comment">
              {score === questions.length && "👑 Perfect Score! You are a true King Kohli fan!"}
              {score >= 3 && score < questions.length && "🔥 Great job! You know your stats well!"}
              {score < 3 && "🏏 Time to study the record books and try again!"}
            </p>
            <button className="reset-btn" onClick={resetQuiz}>
              <RotateCcw size={16} />
              <span>Retry Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriviaQuiz;
