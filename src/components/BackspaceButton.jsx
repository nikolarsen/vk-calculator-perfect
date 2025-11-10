import React from 'react';
import { Icon28DeleteOutline } from '@vkontakte/icons';

const BackspaceButton = ({ onClick }) => {
  return (
    <button
      className="calculator-button calculator-button--function calculator-button--backspace"
      onClick={onClick}
    >
      <Icon28DeleteOutline width={24} height={24} />
    </button>
  );
};

export default BackspaceButton;