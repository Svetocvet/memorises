import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.scss';
import App from './components/App';
import * as serviceWorker from './components/serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
