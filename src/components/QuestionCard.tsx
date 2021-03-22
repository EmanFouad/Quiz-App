import { AnswerObject } from './../App';

export interface QuestionCardProps {
    question: string;
    answers: string[];
    callback: (e:React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: AnswerObject | undefined;
    questionNum: number;
    totalQuestions: number;
    fiftyFiftyAnswers: string[];
    usedFiftyFifyt:boolean;
    toggle:boolean
}
 
const QuestionCard = ({question , answers , callback , userAnswer , questionNum , totalQuestions , fiftyFiftyAnswers , usedFiftyFifyt , toggle}:QuestionCardProps) => {

    return ( 
        <>
        <div className="bg-white shadow-xl rounded-lg px-3 py-8 mb-5" style={{border: "1.3px solid #0500FF"}}>
            <h3 className="font-medium text-sm mb-2">
                Question: {questionNum} / {totalQuestions}
            </h3>
            <p className="text-lg" dangerouslySetInnerHTML={{__html: question}} />
        </div>
        <div>
            {toggle && answers.map((answer , index) => {
                return (
                <button className={`${userAnswer?.correctAnswer === answer ? "bg-green-400" : userAnswer?.correctAnswer !== answer && userAnswer?.answer === answer ? "bg-red-500" : "bg-white"} block w-full py-2 my-6 bg-white shadow-lg rounded-lg hover: border-2 hover:border-blue-700 focus:outline-none focus:ring-offset-blue-700`} 
                key={index} disabled={userAnswer ? true : false} value={answer} onClick={callback} >
                    <span dangerouslySetInnerHTML={{__html:answer}} />
                </button>
                ) 
            })}
            {!usedFiftyFifyt && !toggle && fiftyFiftyAnswers.map((answer , index) => {
                return (
                    <button className={`${userAnswer?.correctAnswer === answer ? "bg-green-400" : userAnswer?.correctAnswer !== answer && userAnswer?.answer === answer ? "bg-red-500" : "bg-white"} block w-full py-2 my-6 bg-white shadow-lg rounded-lg hover: border-2 hover:border-blue-700 focus:outline-none focus:ring-offset-blue-700`} 
                    key={index} disabled={userAnswer ? true : false} value={answer} onClick={callback} >
                        <span dangerouslySetInnerHTML={{__html:answer}} />
                    </button>
                    ) 
            })}
            
        </div>
        </>
     );
}
 
export default QuestionCard;