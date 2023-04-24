import React from 'react';
import { PDFDownloadLink } from 'react-to-pdf';
import MyPDFContent from './MyPDFContent';

type Props = {
  questions: [];
  score: number;
};

const QuizResultsPDF: React.FC<Props> = ({ questions, score }) => {
  const pdfProps = {
    name: 'John',
    age: 30,
 questions: questions,
    score: score,
  };

  return (
    <PDFDownloadLink document={<MyPDFContent {...pdfProps} />} fileName="mypdf.pdf">
      {({ blob, url, loading, error }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        <button disabled={loading}>
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      }
    </PDFDownloadLink>
  );
};

export default QuizResultsPDF;
