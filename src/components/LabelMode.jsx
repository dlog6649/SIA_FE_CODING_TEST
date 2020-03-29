import React, {useState, useEffect} from 'react';
import { LABEL_CREATE_MODE, LABEL_SELECT_MODE } from '../modules/annotator';


export default function LabelMode(props) {
    const [mode, setMode] = useState(props.mode);


    useEffect(() => {
        console.log('LabelMode useEffect: [props.mode]');

        document.querySelector('.label-mode').childNodes.forEach(modeBtn => {
            props.mode === modeBtn.id ? modeBtn.classList.add('active') : modeBtn.classList.remove('active');
        });
    }, [props.mode]);


    const clickBtn = e => {
        let clickedMode = e.currentTarget.id;
        
        if(mode === clickedMode) {
            return;
        }

        document.querySelector('.label-mode').childNodes.forEach(modeBtn => {
            if(clickedMode === modeBtn.id) {
                modeBtn.classList.add('active');
            }
            else {
                modeBtn.classList.remove('active');
            }
        });
        setMode(clickedMode);
        props.changeMode(clickedMode);
    }

    
    return (
        <div className="label-mode">
            <button id={LABEL_SELECT_MODE} className="btn label-mode-btn active" type="button" onClick={clickBtn}>
                <img className="btn-img" src={require('../asset/images/label_select_mode.png')} alt="label_select_mode"/>
            </button>
            <button id={LABEL_CREATE_MODE} className="btn label-mode-btn" type="button" onClick={clickBtn}>
                <img className="btn-img" src={require('../asset/images/label_create_mode.png')} alt="label_create_mode"/>
            </button>
        </div>
    );
}
