import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router'
import AnnotatorHome from './components/AnnotatorHome';
import AnnotatorAnnotatingLabel from './container/AnnotatorAnnotatingLabel';

export default function App({history}) {
  return (
    <div className="App">
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={AnnotatorHome} />
          <Route path="/view" component={AnnotatorAnnotatingLabel} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
}