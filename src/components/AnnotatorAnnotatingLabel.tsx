import React, {useEffect} from 'react';
import LabelMode from '../container/LabelMode';
import LabelList from '../container/LabelList';
import LabelBoard from '../container/LabelBoard';
import { Link } from 'react-router-dom'

interface Props {
    title: string
}

export default function AnnotatorAnnotatingLabel(props: Props) {
    useEffect(() => {
        console.log('AnnotatorAnnotatingLabel useEffect');
    });
    
    return (
        <div className="viewer">
            <Link to="/"><img src={require('../asset/images/arrow-left.png')} alt="home"/></Link>
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