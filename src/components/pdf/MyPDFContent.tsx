import React from 'react';

type Props = {
  name: string;
  age: number;
};

const MyPDFContent: React.FC<Props> = ({ name, age }) => (
  <div>
    <h1>My PDF</h1>
    <p>Name: {name}</p>
    <p>Age: {age}</p>
  </div>
);

export default MyPDFContent;
