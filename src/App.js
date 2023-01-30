import "./App.css";
import React from 'react';
import Questions from "./Questions";

function App() {

  const [quizStarted, setQuizStarted] = React.useState(false)
  const [questions, setQuestions] = React.useState([])
  const [quizFinished, setQuizFinished] = React.useState(false)
  const [score, setScore] = React.useState(0)

  React.useEffect(() => {

    if (quizStarted) {

      fetch("https://opentdb.com/api.php?amount=5&category=18")
      .then(response => response.json())
      .then(data => {
          setQuestions(data.results.map(result => ({
          questionId: generateId(),
          questionText: result.question,
          answers: shuffleArray([...result.incorrect_answers, result.correct_answer]),
          selectedAnswer: "",
          correctAnswer: result.correct_answer,
          isCorrect: false
        })))
      })

    }

  }, [quizStarted])

  function startQuiz() {
    setQuizStarted(true)
  }

  function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5)
    array = array.map(elt => ({answerId: generateId(), answerText: elt, class: "answer center-child"}))
    return array
  }

  function generateId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function handleSelect(questionSelectedId, answerSelectedId) {
    setQuestions(prevQuestions => prevQuestions.map(question => {

      if (question.questionId === questionSelectedId) {
        const answers = question.answers
        let selectedAnswer
        
        const newAnswers = answers.map(answer => {
          if (answer.answerId === answerSelectedId) {
            selectedAnswer = answer.answerText
            return {...answer, class: "answer center-child selected"}
          } else {
            return {...answer, class: "answer center-child"}
          }
        })
        return {...question, selectedAnswer: selectedAnswer, answers: newAnswers}
      } else {
        return question
      }

    }))
  }

  function handleSubmit() {
    setQuizFinished(true)
  }

  React.useEffect(() => {

    if (quizFinished) {
  
      setQuestions(prevQuestions => (
        prevQuestions.map(question => {
          
          const answers = question.answers
          const selectedAnswer = question.selectedAnswer
          const correctAnswer = question.correctAnswer
          let isCorrect = false
          
          // modify classnames of answers based on correct answer
          const newAnswers = answers.map(answer => {
            
            if ((answer.answerText === correctAnswer && answer.answerText === selectedAnswer)) {
  
              isCorrect = true
              return {...answer, class: "answer center-child correct"}
  
            } else if (answer.answerText === correctAnswer && answer.answerText !== selectedAnswer) {

              return {...answer, class: "answer center-child correct"}

            } else if (answer.answerText !== correctAnswer && answer.answerText === selectedAnswer) {
  
              return {...answer, class: "answer center-child wrong"}
  
            } else {
  
              return {...answer, class: "answer center-child disabled"}
  
            }
  
          })
  
          return {...question, answers: newAnswers, isCorrect: isCorrect}
  
        })
      ))
    }

  }, [quizFinished])

  React.useEffect(() => {

    if (quizFinished) {

      setScore(() => {

        let score = 0
        questions.forEach(question => {
          
          if (question.isCorrect) score++

        });

        return score

      })

    }

  }, [questions])

  function handlePlayAgain() {

    setQuizFinished(false)

  }

  React.useEffect(() => {

    if (!quizFinished) {

      setQuizStarted(false)

    }

  }, [quizFinished])

  React.useEffect(() => {

    if (!quizStarted) setQuestions([])

  }, [quizStarted])

  return <main className="center-child">
    {
      !quizStarted ? 
      <>
        <h1>Quizzical</h1>
        <p className="description">Some description if needed</p>
        <button onClick={startQuiz}>Start quiz</button>
      </>
      : 
      <>
        <Questions
          questions={questions}
          handleSelect={handleSelect}
        />
        {
          !quizFinished ?
          <button 
            className="check-answers"
            onClick={handleSubmit}
          >Check answers</button>
          :
          <div className="result">
            <p>You scored {score}/5 correct answers</p>
            <button 
              className="play-again"
              onClick={handlePlayAgain}
            >Play again</button>
          </div>
        }
      </>
    }
  </main>;
}

export default App;