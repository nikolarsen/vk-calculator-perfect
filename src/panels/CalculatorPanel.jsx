import React, { useState, useEffect } from 'react';
import CalculatorDisplay from '../components/CalculatorDisplay';
import CalculatorHistory from '../components/CalculatorHistory';
import CalculatorButton from '../components/CalculatorButton';
import BackspaceButton from '../components/BackspaceButton';

const CalculatorPanel = () => {
  const [expression, setExpression] = useState('0');
  const [history, setHistory] = useState([]);
  const [readyForNewInput, setReadyForNewInput] = useState(false);
  const [errorState, setErrorState] = useState(false);

  // Загрузка истории при старте
  useEffect(() => {
    const savedHistory = localStorage.getItem('calcHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);
      }
    }
  }, []);

  // Сохранение истории при изменении
  useEffect(() => {
    localStorage.setItem('calcHistory', JSON.stringify(history));
  }, [history]);

  // Безопасное вычисление
  const safeEval = (expr) => {
    const jsExpr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/%/g, '/100')
      .replace(/\s/g, '');

    try {
      const result = eval(`(${jsExpr})`);
      
      if (typeof result !== 'number' || !isFinite(result)) {
        return null;
      }
      
      if (Math.abs(result) > 1e15) return null;
      if (Math.abs(result) < 1e-15 && result !== 0) return 0;
      
      return Number.isInteger(result) ? result : parseFloat(result.toFixed(10));
    } catch (error) {
      return null;
    }
  };

  // Обработка чисел
  const handleNumberInput = (number) => {
    if (errorState) setErrorState(false);
    
    if (readyForNewInput || expression === '0') {
      setExpression(String(number));
      setReadyForNewInput(false);
    } else {
      setExpression(expression + String(number));
    }
  };

  // Обработка операторов
  const handleOperatorInput = (operator) => {
    if (errorState) setErrorState(false);
    
    if (readyForNewInput) {
      setExpression(expression + operator);
      setReadyForNewInput(false);
    } else {
      const lastChar = expression.slice(-1);
      const ops = ['+', '−', '×', '÷'];
      
      if (ops.includes(lastChar)) {
        setExpression(expression.slice(0, -1) + operator);
      } else {
        setExpression(expression + operator);
      }
    }
  };

  // Обработка равно
  const handleEquals = () => {
    if (errorState || !expression) return;
    
    const result = safeEval(expression);
    
    if (result === null) {
      setErrorState(true);
    } else {
      const historyEntry = `${expression} = ${result}`;
      setHistory(prev => [historyEntry, ...prev.slice(0, 49)]);
      
      setExpression(String(result));
      setReadyForNewInput(true);
    }
  };

  // Обработка выбора из истории
  const handleHistorySelect = (historyItem) => {
    if (errorState) setErrorState(false);
    
    try {
      const result = historyItem.split(' = ')[1];
      
      if (readyForNewInput || expression === '0') {
        setExpression(result);
        setReadyForNewInput(false);
      } else {
        const lastChar = expression.slice(-1);
        const operators = ['+', '−', '×', '÷'];
        
        if (operators.includes(lastChar)) {
          setExpression(expression + result);
        } else if (/[0-9.]/.test(lastChar)) {
          const numbers = expression.match(/([0-9.]+)$/);
          if (numbers) {
            const lastNumber = numbers[1];
            setExpression(expression.slice(0, -lastNumber.length) + result);
          } else {
            setExpression(expression + result);
          }
        } else {
          setExpression(expression + result);
        }
      }
    } catch (error) {
      console.error('Ошибка при выборе из истории:', error);
    }
  };

  // Backspace
  const handleBackspace = () => {
    if (errorState) setErrorState(false);
    
    if (expression.length > 1) {
      setExpression(expression.slice(0, -1));
    } else {
      setExpression('0');
    }
  };

  // Очистка
  const handleClear = () => {
    setExpression('0');
    setErrorState(false);
    setReadyForNewInput(false);
  };

  // Очистка истории
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Точка
  const handleDecimal = () => {
    if (errorState) setErrorState(false);
    
    if (readyForNewInput) {
      setExpression('0.');
      setReadyForNewInput(false);
    } else if (expression === '0') {
      setExpression('0.');
    } else {
      const parts = expression.split(/[+−×÷]/);
      const lastNumber = parts[parts.length - 1];
      if (!lastNumber.includes('.')) {
        setExpression(expression + '.');
      }
    }
  };

  // Обработка процентов
  const handlePercent = () => {
    if (errorState) setErrorState(false);
    
    if (!expression || expression === '0') return;
    
    try {
      const parts = expression.split(/[+−×÷]/);
      const lastNumberStr = parts[parts.length - 1];
      const lastNumber = parseFloat(lastNumberStr);
      
      if (isNaN(lastNumber)) return;
      
      const percentValue = lastNumber / 100;
      const lastNumberIndex = expression.lastIndexOf(lastNumberStr);
      const newExpression = expression.slice(0, lastNumberIndex) + percentValue.toString();
      setExpression(newExpression);
      
    } catch (error) {
      console.error('Ошибка при вычислении процента:', error);
    }
  };

  const buttonLayout = [
    [
      { label: 'AC', type: 'function', action: handleClear },
      { label: '( )', type: 'function', action: () => {} },
      <BackspaceButton key="backspace" onClick={handleBackspace} />,
      { label: '÷', type: 'operator', action: () => handleOperatorInput('÷') }
    ],
    [
      { label: '7', type: 'number', action: () => handleNumberInput(7) },
      { label: '8', type: 'number', action: () => handleNumberInput(8) },
      { label: '9', type: 'number', action: () => handleNumberInput(9) },
      { label: '×', type: 'operator', action: () => handleOperatorInput('×') }
    ],
    [
      { label: '4', type: 'number', action: () => handleNumberInput(4) },
      { label: '5', type: 'number', action: () => handleNumberInput(5) },
      { label: '6', type: 'number', action: () => handleNumberInput(6) },
      { label: '−', type: 'operator', action: () => handleOperatorInput('−') }
    ],
    [
      { label: '1', type: 'number', action: () => handleNumberInput(1) },
      { label: '2', type: 'number', action: () => handleNumberInput(2) },
      { label: '3', type: 'number', action: () => handleNumberInput(3) },
      { label: '+', type: 'operator', action: () => handleOperatorInput('+') }
    ],
    [
      { label: '%', type: 'function', action: handlePercent },
      { label: '0', type: 'number', action: () => handleNumberInput(0) },
      { label: '.', type: 'function', action: handleDecimal },
      { label: '=', type: 'operator', action: handleEquals }
    ]
  ];

  return (
    <div className="calculator-container">
      <CalculatorHistory 
        history={history} 
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
      />
      
      <CalculatorDisplay 
        expression={expression}
        error={errorState}
      />
      
      <div className="calculator-buttons">
        {buttonLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="calculator-row">
            {row.map((button, buttonIndex) => {
              if (React.isValidElement(button)) {
                return React.cloneElement(button, { key: buttonIndex });
              }
              return (
                <CalculatorButton
                  key={buttonIndex}
                  label={button.label}
                  type={button.type}
                  onClick={button.action}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorPanel;