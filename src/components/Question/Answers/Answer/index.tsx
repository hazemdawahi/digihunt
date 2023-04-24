/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
export default function Answer(props) {
    const { icon, answerQuestion, answerText, answerValue } = props;
    return (
        <li>
            <button
                className="p-2 flex items-center gap-2 hover:text-blue-900"
                onClick={() => answerQuestion(answerValue)}
            >
                <span>{icon}</span>
                {`${answerValue}. ${answerText}`}
            </button>
        </li>
    );
}

