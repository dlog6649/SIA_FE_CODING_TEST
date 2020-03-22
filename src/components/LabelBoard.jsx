import React, {useEffect} from 'react';
import {initialize, finalize, setMode, getLabels, setSelectedLabelList} from '../label';

export default function LabelBoard(props) {

    useEffect(() => {
        console.log('LabelBoard useEffect');

        document.addEventListener('mouseup', e => {
            props.updateLabel(getLabels());
        });

        initialize();

        return () => finalize();
    },[]);

    useEffect(() => {
        console.log('mode changed: ', props.mode);
        console.log(props);
        setMode(props.mode);

        setSelectedLabelList(props.selectedLabels);
    });
    
    return (
        <div className="label-board">
            <svg id="svg" width="100%" height="100%">
                <image id="cardImage" href={props.url} x="0" y="0" alt="cardImage"/>
            </svg>
            {/* <input type="button" onClick={() => {
                document.querySelector('#te').setAttribute('x', parseInt(document.querySelector('#te').getAttribute('x')) + 5);
            }} value="MoveImage"/> */}
        </div>
    );
}