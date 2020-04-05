import React from 'react';
import ReactDOM from 'react-dom';
import './asset/css/design.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configureStore, { history } from './configureStore';
import App from './App';


const store = configureStore(/* provide initial state if any */);


ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>
, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
