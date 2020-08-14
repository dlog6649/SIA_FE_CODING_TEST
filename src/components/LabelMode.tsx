import React, { useState, useEffect, useRef } from 'react';
import { LABEL_CREATE_MODE, LABEL_SELECT_MODE } from '../modules/annotator';

interface Props {
    mode: string
    changeMode: (mode: string) => void
}

export default function LabelMode(props: Props) {
    const [mode, setMode] = useState(props.mode);
    const refModeBtnList: React.MutableRefObject<any> = useRef(null);

    useEffect(() => {
        console.log('LabelMode useEffect: [props.mode]');
        refModeBtnList.current.childNodes.forEach((modeBtn: HTMLElement) => {
            props.mode === modeBtn.id ? modeBtn.classList.add('active') : modeBtn.classList.remove('active');
        });
    }, [props.mode]);

    const clickBtn = (evt: React.FormEvent<HTMLButtonElement>) => {
        const clickedMode: string = evt.currentTarget.id;
        if(mode === clickedMode) {
            return;
        }
        refModeBtnList.current.childNodes.forEach((modeBtn: HTMLElement) => {
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
        <div className="label-mode" ref={refModeBtnList}>
            <button id={LABEL_SELECT_MODE} className="btn label-mode-btn active" type="button" onClick={clickBtn}>
                <img className="btn-img" src={require('../asset/images/label_select_mode.png')} alt="label_select_mode"/>
            </button>
            <button id={LABEL_CREATE_MODE} className="btn label-mode-btn" type="button" onClick={clickBtn}>
                <img className="btn-img" src={require('../asset/images/label_create_mode.png')} alt="label_create_mode"/>
            </button>
        </div>
    );
}
