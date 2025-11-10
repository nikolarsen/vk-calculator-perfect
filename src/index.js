import React from 'react';
import ReactDOM from 'react-dom/client';
import bridge from '@vkontakte/vk-bridge';
import App from './App';

// Инициализация VK Mini App
bridge.send('VKWebAppInit')
  .then(() => {
    console.log('VK Mini App initialized successfully');
  })
  .catch((error) => {
    console.log('VK init error:', error);
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);