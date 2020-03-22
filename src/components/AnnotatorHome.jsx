import React, {useEffect} from 'react';
import CardContainer from '../container/CardContainer.jsx';

export default function AnnotatorHome() {
    useEffect(() => {
        console.log('AnotatorHome useEffect');
    },[]);

    return (
        <div className="home">
            <div className="home-title">
                <h1>Annotator Home</h1>
            </div>
            <div className="home-content">
                <CardContainer />
            </div>
        </div>
    );
}