import React from 'react';
import ReactDOM from 'react-dom';
import './asset/css/design.css';
import * as serviceWorker from './serviceWorker';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import configureStore, { history } from './configureStore';
import App from './App';
import { Route, Switch } from 'react-router'
import AnnotatorHome from './components/AnnotatorHome';
import AnnotatorAnnotatingLabel from './container/AnnotatorAnnotatingLabel';


const store = configureStore(/* provide initial state if any */);

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
    {/* <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" component={AnnotatorHome} />
        <Route path="/view" component={AnnotatorAnnotatingLabel} />
      </Switch>
    </ConnectedRouter> */}
  </Provider>
, document.getElementById('root'));


// const render = () => {
//   
// };

// // Hot reloading
// if (module.hot) {
//   // Reload components
//   module.hot.accept('./App', () => {
//     render()
//   })
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
