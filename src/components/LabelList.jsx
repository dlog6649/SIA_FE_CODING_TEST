import React, {useEffect} from 'react';
import { LABEL_SELECT_MODE, LABEL_CREATE_MODE } from '../modules/annotator';


export default function LabelList(props) {


    useEffect(() => {
        console.log('LabelList useEffect [props.lbls]');
        
        let lbls = props.lbls;
        if (!lbls) {
            lbls = [];
        }

        let labelListRoot = document.querySelector('.label-list-root');

        while(labelListRoot.firstChild) {
            labelListRoot.removeChild(labelListRoot.firstChild);
        }

        let labelList = '';

        lbls.forEach(label => {
            if(props.selLblIds.find(id => id === label.id)) {
                labelList += `<li class="label-info btn active"`;
            }
            else {
                labelList += `<li class="label-info btn"`;
            }

            // coordinates
            // 0 1
            // 3 2
            labelList += `
                data-id="${label.id}"
            >
                <p class="label-class">${label.name}</p>
                <p class="label-coordinate">
                    (${parseInt(label.coordinates[0].x)}, ${parseInt(label.coordinates[0].y)})
                    (${parseInt(label.coordinates[1].x)}, ${parseInt(label.coordinates[1].y)})
                    (${parseInt(label.coordinates[2].x)}, ${parseInt(label.coordinates[2].y)})
                    (${parseInt(label.coordinates[3].x)}, ${parseInt(label.coordinates[3].y)})
                </p>
            </li>
            `;
        });

        labelListRoot.innerHTML = labelList;

    }, [props.lbls]);


    useEffect(() => {
        console.log('LabelList useEffect [props.selLblIds]');
        
        if(compareIds(props.selLblIds)) {
            console.log('LabelList useEffect [props.selLblIds] returned');
            return;
        }

        document.querySelectorAll('.label-info').forEach(labelInfo => {
            labelInfo.classList.remove('active');

            props.selLblIds.forEach(id => {
                if(labelInfo.dataset.id === id) {
                    labelInfo.classList.add('active');
                }
            });
        });

    }, [props.selLblIds]);


    const compareIds = (propsIds) => {
        let ids = [];
        document.querySelectorAll('.label-info.active').forEach(labelInfo => {
            ids.push(labelInfo.dataset.id);
        });
        if(ids.length !== propsIds.length) {
            return false;
        }
        for(let i = 0; i < propsIds.length; i++) {
            if(!ids.includes(propsIds[i])) {
            return false;
            }
        }
        return true;
    }


    const toggleLabelList = () => {
        let controller = document.querySelector('.label-list-controller');
        let img = document.querySelector('.label-list-btn-img');
        let labelList = document.querySelector('.label-list-root');

        if(labelList.style.display === 'block') {
            controller.firstChild.style.display = 'none';
            controller.style.minWidth = '38px';
            img.src = require('../asset/images/arrow-right.png');
            labelList.style.display = 'none';
        }
        else {
            controller.firstChild.style.display = 'block';
            controller.style.minWidth = '300px';
            img.src = require('../asset/images/arrow-left.png');
            labelList.style.display = 'block';
        }
    };
    

    const selectLabel = e => {
        if(props.mode === LABEL_CREATE_MODE) {
            return;
        }
        
        let _labelInfo;
        _labelInfo = e.target.classList.value.indexOf('label-info') !== -1 ? e.target : e.target.parentNode;
        _labelInfo.classList.add('active');

        if(!e.ctrlKey) {
            document.querySelectorAll('.label-info.active').forEach(labelInfo => {
                if(_labelInfo === labelInfo) {
                    return true;
                }
                labelInfo.classList.remove('active');
            });
        }

        let ids = [];
        document.querySelectorAll('.label-info.active').forEach(labelInfo => {
            ids.push(labelInfo.dataset.id);
        });

        props.selectLabels(ids);
    }


    return (
        <div className="label-list">
            <div className="label-list-controller">
                <span>Labels</span>
                <button className="btn label-list-btn" onClick={toggleLabelList} type="button">
                    <img className="label-list-btn-img" src={require('../asset/images/arrow-left.png')} alt="arrow-left"/>
                </button>
            </div>
            <ul className="label-list-root" style={{display:'block'}} onMouseDown={selectLabel}>
            </ul>
        </div>
    );
}
