import React, {useState, useEffect} from 'react';
import * as label from '../label';
// {initialize, finalize, setMode, getLabels, setSelectedLabelList}

export let _props;

export default function LabelBoard(props) {
    const [mode, setMode] = useState(props.mode);

    useEffect(() => {
        console.log('LabelBoard useEffect');

        _props = props;

        label.initialize();

        return () => label.finalize();
    },[]);

    useEffect(() => {
        console.log('mode changed: ', props.mode);

        // if(mode === props.mode) {
        //     return;
        // }
        // setMode(props.mode);

        label.setIds(props.selectedLabelIds);
        label.setMode(props.mode);

    });
    
    return (
        <div className="label-board">
            <svg id="svg" width="100%" height="100%">
                <g id="mainG" transform="translate(0 0) scale(1)">
                    <image id="cardImage" href={props.curImgURL} alt="cardImage"/>
                </g>
            </svg>
            {/* <input type="button" onClick={() => {
                document.querySelector('#te').setAttribute('x', parseInt(document.querySelector('#te').getAttribute('x')) + 5);
            }} value="MoveImage"/> */}
        </div>
    );
}