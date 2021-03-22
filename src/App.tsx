import React, { useState , useEffect } from 'react';
import ReactLoading from 'react-loading';
import Modal from 'react-modal';
import Countdown from 'react-countdown';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

import logo from './svg/logo.png';
import './App.css';
import { fetchQuizQuestions, QuestionState , Difficulty } from './API';
import QuestionCard from './components/QuestionCard';
import Stopwatch from './svg/Stopwatch';
import Option from './svg/Option';
import Rating from './svg/Rating';
import { shuffleArray } from './utils';


export type AnswerObject = {
  question: string,
  answer: string,
  correct: boolean,
  correctAnswer: string
}

const TOTAL_QUESTIONS = 10;

function App() {
  const [loading, setLoading] = useState(false);
  const[questions, setQuestions] = useState<QuestionState[]>([]);
  const[number, setNumber] = useState(0);
  const[userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const[score, setScore] = useState(0);
  const[gameOver, setGameOver] = useState(true);
  const [numbersWidget , setNumbersWidget] = useState<Number[]>([]);
  const [fiftyfifyt , setFiftyFifty] = useState<number>(2);
  const [usedFiftyFifyt , setUsedFiftyFifty] = useState<boolean>(false);
  const [fiftyFiftyAnswers , setFiftyFiftyAnswers] = useState<string[]>([]);
  const [toggle , setToggle] = useState<boolean>(true);
  const [time , setTime] = useState(0);

  // const [timer , setTimer] = useState({min: 0 , sec: 0});
  // const [intervalTime , setIntervalTime] = useState<any>(null);

  // Modal
  const [modalIsOpen , setModalIsOpen] =useState(false);
  Modal.setAppElement('#root');
  const customStyles = {
    content : {
      width  : '50%',
      height : '55%',
      margin : 'auto'
    }
  };

  useEffect(() => {
    if(number > 0 && number <= TOTAL_QUESTIONS) {
      setNumbersWidget([...numbersWidget , number])
    }else{
      setNumbersWidget([])
    }
  }, [number])

  // useEffect(()=>{
  //   let distance;
  //   const countDownTime = Date.now() + 10000;
  //   const t = setInterval(() => {
  //     const now:any = new Date();
  //     distance = countDownTime - now;
  //     const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60 *60));
  //     const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  //     if(distance < 0 ){
  //       clearInterval(intervalTime);
  //       setTimer({min:0 , sec:0}); 
  //       !gameOver && setModalIsOpen(true);  
  //       console.log(gameOver)
  //     }else{
  //       setTimer({min:minutes , sec:seconds});
  //     }
  //   },1000)
  //   setIntervalTime(t)
  // },[gameOver])

  const startTrivia = async () => {
    setTime(Date.now() + 90000);
    setFiftyFifty(2);
    setUsedFiftyFifty(false);
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS , Difficulty.HARD)
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e:React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if(correct) {setScore(prev => prev + 1)};
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev , answerObject]);
    }
  }

  const nextQuestion = () => {
    setToggle(true);
    const nextQuestion = number + 1;
    if(nextQuestion === TOTAL_QUESTIONS || userAnswers.length === TOTAL_QUESTIONS){
        setModalIsOpen(true);
        setTime(0);
    }else{
      setNumber(nextQuestion);
    }
  }

  const handleQuit = () =>{
    setModalIsOpen(true);
    setTime(0);
  }

  const handleFiftyFifty = () =>{
    if(fiftyfifyt > 0 && !usedFiftyFifyt){
      let fiftyAnswers = [];
      const randomNum = Math.round(Math.random() * 2);
      
      //Removing One Answer
      // questions[number].incorrect_answers = questions[number].incorrect_answers.filter(a => a !== questions[number].incorrect_answers[randomNum]);
      // fiftyAnswers = shuffleArray([...questions[number].incorrect_answers,questions[number].correct_answer])
     
      //Removing Two Answers
      fiftyAnswers = shuffleArray([questions[number].incorrect_answers[randomNum],questions[number].correct_answer])
     
      setFiftyFiftyAnswers(fiftyAnswers)
      setFiftyFifty(prev => prev - 1);
      setToggle(false);
    }else{
      setUsedFiftyFifty(true);
    }
  }

  // Time renderer
  const renderer = ({minutes, seconds, completed }:any) => {
    if (completed) {
      // Render a complete state
      setModalIsOpen(true)
      return <Modal isOpen={modalIsOpen} style={customStyles} >
      <div className="relative flex flex-col justify-center items-center h-full">
        <Rating />
        <p className="text-blue-700 md:text-xl mt-5">Your score is <strong>{score}</strong> points</p>
        <button className="absolute right-0 top-0 text-sm focus:outline-none" onClick ={() => {setGameOver(true); setModalIsOpen(false);}}>X</button>
      </div>
    </Modal>
    } else {
      // Render a countdown
      return (
        <span className="ml-1">
          {minutes}:{seconds}
        </span>
      );
    }
  };


  return (
    <>
    {gameOver  &&
      <div className="flex justify-center items-center h-screen overflow-hidden">
        <div className="bg-white w-1/2 h-1/2 p-10  shadow-xl rounded-lg flex flex-col items-center">
          <img className="w-40 mt-3" src={logo} alt="logo"/> 
          <button className="px-10 py-3 mt-4 shadow-xl rounded-md font-medium bg-secondary focus:outline-none" onClick={startTrivia}>Start</button>
        </div>
      </div>
    }
    <Modal isOpen={modalIsOpen} style={customStyles} >
      <div className="relative flex flex-col justify-center items-center h-full">
        <Rating />
        <p className="text-blue-700 text-lg">Your score is <strong>{score}</strong></p>
        <button className="absolute right-0 top-0 text-sm focus:outline-none" onClick ={() => {setGameOver(true); setModalIsOpen(false);}}>X</button>
      </div>
    </Modal>
    {!gameOver && 
    <div className="md:container md:mx-auto mx-4 md:mt-20 mt-8">
      <div className="md:flex md:justify-around">
          {!gameOver && 
          <div className="md:w-3/12 bg-white shadow-xl rounded-lg order-2 p-4 md:h-96 relative mb-4"> 
            <div className="flex justify-between mb-4">
              <Tippy content="Helping option is used to delete two wrong answers for TWO times only"
              theme="light-border">
                <button className="flex justify-between items-center bg-white
                shadow-md rounded-lg px-4 hover: border hover:border-blue-700 focus:outline-none" onClick={handleFiftyFifty}>
                  <Option />
                  <p className="ml-1">{fiftyfifyt}</p>
                </button>
              </Tippy>
              <div className="flex justify-between items-center">
                <Stopwatch />
                <Countdown date={time} renderer={renderer} />
              </div>
            </div>
            <div className="flex flex-wrap mb-4 border-b">
              { numbersWidget.map((n , indx) => {
                let bgColor = userAnswers.map(u => {return u.correct ? "bg-green-400" : "bg-red-500" })
                return(
                    <div key={indx} className="md:w-1/5 w-1/12 mb-4">
                      <div className={`w-6 h-6 rounded-xl text-center pt-0.5 ${bgColor[indx]} text-white text-sm`}>{n}</div>
                    </div>  
                )
              })
              }
            </div>
            <p className="font-bold text-blue-700 md:block inline-block ">Score: {score}</p>
            <div className="md:flex md:justify-center md:w-full absolute md:left-0 md:bottom-4 right-3 bottom-2">
              <button className="bg-white shadow-md rounded-lg text-red-500 px-6 py-2 md:my-4
               focus:outline-none hover:bg-red-500 hover:text-white" onClick={handleQuit}>Quit</button>
            </div>
          </div>
          }
          <div className="md:w-8/12 bg-white order-1">
            {loading && 
              <div className="flex justify-center items-center h-screen">
                <ReactLoading type={'bubbles'} color={'#0500FF'} height={'10%'} width={'10%'} />
              </div>
            }
            {!loading && !gameOver && 
              <QuestionCard question={questions[number].question}
                  answers={questions[number].answers}
                  userAnswer={userAnswers.length ? userAnswers[number]: undefined} 
                  callback={checkAnswer} 
                  questionNum={number + 1} 
                  totalQuestions={TOTAL_QUESTIONS}
                  fiftyFiftyAnswers={fiftyFiftyAnswers}
                  usedFiftyFifyt={usedFiftyFifyt}
                  toggle={toggle} /> 
            }
            {!gameOver && !loading && userAnswers.length === number + 1 &&
              <div className="flex justify-center">
                <button className="bg-white shadow-md rounded-lg text-blue-700
                 px-6 py-2 focus:outline-none hover:bg-blue-700 hover:text-white" onClick={nextQuestion}>{number === TOTAL_QUESTIONS - 1 ? "Finish" :"Next"}</button>
              </div>
            }
          </div>
      </div>
    </div>
    }
    </>
  );
}

export default App;
