import React from 'react';

const CalculatorDisplay = ({ expression, error }) => {
  const formatDisplayValue = (value) => {
    if (!value || value === '0') return '0';
    
    if (/[+−×÷%]/.test(value)) {
      return value;
    }
    
    try {
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      
      const absNum = Math.abs(num);
      const strNum = value.toString();
      
      if (strNum.length > 12) {
        if (absNum >= 1e12) {
          return num.toExponential(6).replace('e', 'E');
        }
        
        if (absNum > 0 && absNum < 1e-6) {
          return num.toExponential(6).replace('e', 'E');
        }
        
        if (strNum.includes('.')) {
          const [integer, decimal] = strNum.split('.');
          if (integer.length > 8) {
            return num.toExponential(6).replace('e', 'E');
          }
          if (decimal.length > 8) {
            return parseFloat(num.toFixed(8)).toString();
          }
        }
        
        return parseFloat(num.toFixed(10)).toString();
      }
      
      return value;
    } catch (error) {
      return value;
    }
  };

  const displayValue = formatDisplayValue(expression);
  
  return (
    <div className={`calculator-display ${error ? 'error' : ''}`}>
      <div className="calculator-display-value">
        {error ? 'Ошибка' : displayValue}
      </div>
    </div>
  );
};

export default CalculatorDisplay;