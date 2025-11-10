import React from 'react';
import { ConfigProvider, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import CalculatorPanel from './panels/CalculatorPanel';
import './styles/calculator.css';

const App = () => {
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <CalculatorPanel />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;