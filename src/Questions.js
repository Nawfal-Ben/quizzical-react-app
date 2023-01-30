import "./App.css";

function Questions({questions, handleSelect}) {
  return <div className="question">
    {
      questions.map(question => (
        <div key={question.questionId}>
          <h2 dangerouslySetInnerHTML={{ __html: question.questionText }} />
          <div className="answers">
            {
              question.answers.map(answer => (<span className={answer.class}
              onClick={() => {
                handleSelect(question.questionId, answer.answerId)
              }}
              key={answer.answerId} dangerouslySetInnerHTML={{ __html: answer.answerText }} />))
            }
          </div>
          <hr />
        </div>
      ))
    }
  </div>
}

export default Questions