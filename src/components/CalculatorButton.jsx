import React from 'react';

const CalculatorButton = ({ label, type, onClick }) => {
  return (
    <button
      className={`calculator-button calculator-button--${type}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;