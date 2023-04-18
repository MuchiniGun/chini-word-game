import axios from 'axios'
import { useEffect, useState } from 'react'

const App = () => {
  const [chosenLevel, setChosenLevel] = useState(null) //should be null
  const [words, setWords] = useState(null)
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [clicked, setClicked] = useState([])
  const [score, setScore] = useState(0)

  // function to get results --> function so that we can control when the data is fetched 
  const getRandomWords = () => {
      // Fetching the data from the API

      const options = {
        method: 'GET', 
        url: 'https://twinword-word-association-quiz.p.rapidapi.com/type1/',
        params: {level: chosenLevel, area: 'sat'},
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
          'X-RapidAPI-Host': 'twinword-word-association-quiz.p.rapidapi.com'
        }
      };

      axios.request(options).then( (response) => {
        console.log(response.data);
        setWords(response.data)
      }).catch( (error) => {
        console.error(error); 
      });

      // first thing we need to do is save the results of the get request to state
  
  }

  console.log(words && words.quizlist)

  useEffect(() => {
   if(chosenLevel) getRandomWords()
  }, [chosenLevel])


  const checkAnswer = (option, optionIndex, correctAnswer, _questionIndex) => {
    console.log(optionIndex, correctAnswer)  
    const questionBox = document.querySelector(`#container-${_questionIndex}`)
    const button = questionBox.querySelectorAll(`#button-id-${_questionIndex}`)
    if(optionIndex ===  correctAnswer ) { 
      setCorrectAnswers([...correctAnswers, option ])
      setScore(score => score + 1)
      questionBox.classList.remove('incorrect')
      questionBox.classList.add('correct')
      button.forEach(btn => btn.disabled = true)
    } else {
      if(score !== 0) setScore(score => score - 1 )
      questionBox.classList.remove('correct')
      questionBox.classList.add('incorrect')
      button.forEach(btn => btn.disabled = true)
    }

    setClicked([...clicked, option])
  }
    
  console.log(correctAnswers)

  return (
    <div className="App">
      
      {
        !chosenLevel 
        &&  
        <div className="level-selector" >

          <h1>Word Association App</h1>
          <p>Select your level to start</p>
          
          <select 
          name="levels"  
          id="level"  
          value={chosenLevel} 
          onChange={(e) => setChosenLevel(e.target.value)}>
            <option value={null}>Select a level</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
            <option value="6">Level 6</option>
            <option value="7">Level 7</option>
            <option value="8">Level 8</option>
            <option value="9">Level 9</option>
            <option value="10">Level 10</option> 
          </select>

          
          
        </div>
      }

      { 
        chosenLevel 
        && 
        words
        &&  
        <div className="question-area">
          <h1>Welcome to level: {chosenLevel}</h1>
          <h3>Your score is : {score}</h3>
          <button onClick={() => setChosenLevel(null)} className="questions-button">BACK</button>


           <div className="questions"> 
           {words.quizlist.map((question, _questionIndex) => (
            <div key={_questionIndex} className="question-box" id={`container-${_questionIndex}`}>

              {question.quiz.map((tip, _index) => (
                <p key={_index}>{tip}</p>
              ))}

              <div className={"question-buttons"} id={`question-buttons-${_questionIndex}`}>
                {question.option.map((option, optionIndex) =>  (
                   <div key={optionIndex}  className={"question-button"} id={`buttons-${_questionIndex}`}>
                    <button 
                      className="answer-button"
                      onClick={() => checkAnswer(option, optionIndex+1 , question.correct, _questionIndex)}
                      id={`button-id-${_questionIndex}`}
                    >{option}</button>
                    {
                      correctAnswers.includes(option) 
                      && 
                      <p>Correct!</p>
                    }
                   </div>
                ))}
              </div>

            </div>
          ))}
           
           </div>
          
        </div>
      }
      
    </div>
  );
}

export default App;
