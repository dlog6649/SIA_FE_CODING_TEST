import React from 'react';
import { LABEL_CREATE_MODE, LABEL_SELECT_MODE } from '../modules/annotator';

export default function LabelMode(props) {

    const clickBtn = e => {
        let mode;

        document.querySelector('.label-mode').childNodes.forEach(node => {
            if(e.currentTarget.id === node.id) {
                node.classList.add('active');
                mode = node.id;
            }
            else {
                node.classList.remove('active');
            }
        })

        props.changeMode(mode);
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
