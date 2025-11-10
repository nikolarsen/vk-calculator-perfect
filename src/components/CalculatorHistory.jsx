import React from 'react';

const CalculatorHistory = ({ history, onSelect, onClear }) => {
  return (
    <div className="calculator-history">
      {history.length === 0 ? (
        <div className="history-placeholder">История вычислений</div>
      ) : (
        <>
          <div className="history-header">
            <span>История</span>
            <button className="clear-history-btn" onClick={onClear}>Очистить</button>
          </div>
          {history.map((item, index) => (
            <div 
              key={index}
              className="history-item"
              onClick={() => onSelect(item)}
            >
              {item}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CalculatorHistory;