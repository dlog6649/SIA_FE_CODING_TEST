import React, {useEffect} from 'react';
import LabelMode from '../container/LabelMode';
import LabelList from '../container/LabelList';
import LabelBoard from '../container/LabelBoard';

export default function AnnotatorAnnotatingLabel(props) {

    useEffect(() => {
        console.log('AnnotatorAnnotatingLabel useEffect');
    });

    return (
        <div className="viewer">
            <a href="AnnotatorHome" onClick={e => {
                e.preventDefault();
                props.onClick();
            }}><img src={require('../asset/images/arrow-left.png')} alt="home"/></a>

            <div className="viewer-title">
                {props.title}
            </div>
            <div className="viewer-content">
                <LabelMode />
                <LabelList />
                <LabelBoard />
            </div>
        </div>
    );
}