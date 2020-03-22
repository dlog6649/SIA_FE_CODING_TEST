import React, {useState, useEffect} from 'react';
import './design.css';
import AnnotatorHome from './components/AnnotatorHome';
import AnnotatorAnnotatingLabel from './container/AnnotatorAnnotatingLabel';
import store from './store';



function App() {
  const [component, setComponent] = useState(<AnnotatorAnnotatingLabel/>);

  useEffect(() => {
    console.log('App useEffect');
  });

  store.subscribe(() => {
    const type = store.getState().type;
    if(type === 'HOME') {
      setComponent(<AnnotatorHome />)
    }else if(type === 'LABEL')
      setComponent(<AnnotatorAnnotatingLabel />)
  });

  return (
    <div className="App">
      {component}
    </div>
  );
}


export default App;