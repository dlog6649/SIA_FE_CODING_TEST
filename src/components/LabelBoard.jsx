import React, {useEffect} from 'react';
import * as label from '../label';

export var _props;

export default function LabelBoard(props) {

    useEffect(() => {
        console.log('LabelBoard useEffect: []');

        _props = props;

        label.initialize();

        return () => label.finalize();
    }, []);

    useEffect(() => {
        console.log('LabelBoard useEffect: [props.mode]: ', props.mode);

        if(label.getMode() === props.mode) {
            console.log('useEffect: [props.mode]: returned ');
            return;
        }

        label.setMode(props.mode);

    }, [props.mode]);

    useEffect(() => {
        console.log('LabelBoard useEffect: [props.image]: ', props.image);

        label.drawImage(props.image);

    }, [props.image]);

    useEffect(() => {
        console.log('LabelBoard useEffect: [props.labels]: ', props.labels);

        label.drawLabels(props.labels, props.selectedLabelIds);

    }, [props.labels]);

    useEffect(() => {
        console.log('LabelBoard useEffect: [props.selectedLabelIds]: ', props.selectedLabelIds);

        if(label.compareIds(props.selectedLabelIds)) {
            console.log('useEffect: [props.selectedLabelIds]: returned');
            return;
        }

        label.setSelectedLabelIds(props.selectedLabelIds);

    }, [props.selectedLabelIds]);

    
    return (
        <div className="label-board">
            <svg id="svg" width="100%" height="100%">
                {/* <image transform="translate(50 50) scale(0.3)" id="cardImage" href="https://via.placeholder.com/600/92c952" alt="cardImage"/> */}
                {/* <rect transform="translate(50 50)" width="100" height="100" fillOpacity="0.1" /> */}
            </svg>
            <div className="label-board-scaler">
                <div className="scaler-plus">+</div>
                <input className="scaler-range" type="range" orient="vertical" />
                <div className="scaler-minus">-</div>
            </div>
        </div>
    );
}

