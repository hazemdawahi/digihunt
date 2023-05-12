import { Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Chart, ArcElement } from 'chart.js';
import styles from '../styles/quizz.module.css';

// Register the 'arc' element
Chart.register(ArcElement);
interface QuizResultsProps {
  score: number;
  totalQuestions: number;
}

const QuizResults: React.FC<QuizResultsProps> = ({ score, totalQuestions }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ['Correct', 'Wrong'],
      datasets: [
        {
          data: [score, totalQuestions - score],
          backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
    });
  }, [score, totalQuestions]);

  return (
    <div>
      <h1>Quiz Results</h1>
      <div className={styles.sized_box}></div>

      <div style={{ width: '300px', height: '300px' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default QuizResults;
