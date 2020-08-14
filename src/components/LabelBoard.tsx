import React, { useState, useEffect } from 'react';
import LabelCtxMenu from './LabelCtxMenu';
import * as LabelMain from '../labeling-tool/LabelMain';
import { redrawImage, redrawLabels } from '../labeling-tool/LabelCreator';
import { compareImage, compareLabels, compareIds } from '../labeling-tool/LabelCompare';

export var _props: Props;
export var _setScale: React.Dispatch<React.SetStateAction<number>>;

interface Label {
    id: number
    name: string
    coordinates: Array<{x:number, y: number}>
    data: {x: number, y: number, w: number, h: number, deg: number}
}

interface Props {
    mode: string
    image: any
    currentImgURL: string
    labels: Array<Label>
    selectedLabelsIds: number[]
}

export default function LabelBoard(props: Props) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        console.log('LabelBoard useEffect: []');
        _props = props;
        _setScale = setScale;
        LabelMain.initialize();
        return () => LabelMain.finalize();
    }, []);

    useEffect(() => {
        console.log('LabelBoard useEffect: [props.mode]: ', props.mode);
        if (LabelMain.getMode() === props.mode) {
            console.log('useEffect: [props.mode]: returned ');
            return;
        }
        LabelMain.setMode(props.mode);
    }, [props.mode]);

    useEffect(() => {
        console.log('LabelBoard useEffect: [props.image]: ');
        if (compareImage(props.image)) {
            console.log('LabelBoard useEffect: [props.image]: returned');
            return;
        }
        redrawImage(props.currentImgURL, props.image);
    }, [props.image]);

    useEffect(() => {
        console.log('LabelBoard useEffect: [props.labels]: ');
        if (compareLabels(props.labels)) {
            console.log('LabelBoard useEffect: [props.labels]: returned');
            return;
        }
        redrawLabels(props.labels);
    }, [props.labels]);

    useEffect(() => {
        console.log('LabelBoard useEffect: [props.selectedLabelsIds]: ');
        if (compareIds(props.selectedLabelsIds)) {
            console.log('LabelBoard useEffect: [props.selectedLabelsIds]: returned');
            return;
        }
        LabelMain.createAnchorsInSelectedLabelsIds(props.selectedLabelsIds);
    }, [props.selectedLabelsIds]);

    const changeScale = (evt: any): void => {
        setScale(parseFloat(evt.target.value));
    }

    const changeSliderCSS = (evt: any): void => {
        let value = evt.target.value;
        if (value <= 0.1) {
            value = 0;
        }
        evt.target.style.background = 'linear-gradient(to right, #333333 0%, #333333 ' + value * 50 + '%, #dedede ' + value * 50 + '%, #dedede 100%)';
    }

    return (
        <div className="label-board">
            <svg id="svg" width="100%" height="100%" data-testid="testSvg">
                <defs>
                    <filter id="f1">
                        <feDropShadow dx="-1" dy="1" stdDeviation="2.5" floodColor="gray" />
                    </filter>
                </defs>
            </svg>
            <div className="label-board-scaler">
                <img className="scaler-plus btn-img" src={require('../asset/images/plus.png')} alt="+" />
                <input className="scaler-range" orient="vertical" type="range" data-testid="testScaler" value={scale} onInput={changeSliderCSS} onChange={changeScale} min="0.1" max="2" step="0.1" />
                <img className="scaler-minus btn-img" src={require('../asset/images/minus.png')} alt="-" />
            </div>
            <LabelCtxMenu />
        </div>
    );
}
