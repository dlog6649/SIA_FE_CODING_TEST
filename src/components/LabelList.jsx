import React, { useEffect, useRef } from 'react';
import { LABEL_CREATE_MODE } from '../modules/annotator';


const compareIds = (_ids) => {
    let ids = [];
    document.querySelectorAll('.label-info.active').forEach(labelInfo => {
        ids.push(parseInt(labelInfo.dataset.id));
    });
    if (ids.length !== _ids.length) {
        return false;
    }
    for (let i = 0; i < _ids.length; i++) {
        if (parseInt(_ids[i]) !== parseInt(ids[i])) {
            return false;
        }
    }
    return true;
}


export default function LabelList(props) {

    const refLabelList = useRef(null);

    useEffect(() => {
        console.log('LabelList useEffect [props.labels]');
        let labels = props.labels;
        if (!labels) {
            labels = [];
        }

        let labelListRoot = refLabelList.current.lastChild;

        while(labelListRoot.firstChild) {
            labelListRoot.removeChild(labelListRoot.firstChild);
        }

        let labelList = '';

        labels.forEach(label => {
            labelList += `
                <li class="label-info btn" data-id="${label.id}" data-testid="testLabelInfo">
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

        labelListRoot.insertAdjacentHTML('afterbegin', labelList);
        
    }, [props.labels]);


    useEffect(() => {
        console.log('LabelList useEffect [props.selectedLabelsIds]');

        if(compareIds(props.selectedLabelsIds)) {
            console.log('LabelList useEffect [props.selectedLabelsIds] returned');
            return;
        }

        document.querySelectorAll('.label-info').forEach(labelInfo => {
            labelInfo.classList.remove('active');

            props.selectedLabelsIds.forEach(id => {
                if(parseInt(labelInfo.dataset.id) === parseInt(id)) {
                    labelInfo.classList.add('active');
                }
            });
        });

    }, [props.selectedLabelsIds]);


    const toggleLabelList = () => {
        let controller = document.querySelector('.label-list-controller');
        let img = document.querySelector('.label-list-btn-img');
        let labelListRoot = document.querySelector('.label-list-root');

        if (labelListRoot.style.display === 'block') {
            controller.firstChild.style.display = 'none';
            controller.style.minWidth = '38px';
            controller.style.borderRight = '1px solid lightgray';
            img.src = require('../asset/images/arrow-right.png');
            labelListRoot.style.display = 'none';
            labelListRoot.parentNode.style.borderRight = 'none';
        }
        else {
            controller.firstChild.style.display = 'block';
            controller.style.minWidth = '300px';
            controller.style.borderRight = 'none';
            img.src = require('../asset/images/arrow-left.png');
            labelListRoot.style.display = 'block';
            labelListRoot.parentNode.style.borderRight = '1px solid lightgray';
        }
    };
    

    const selectLabel = e => {
        if(props.mode === LABEL_CREATE_MODE) {
            return;
        }
        
        let _labelInfo;
        _labelInfo = e.target.classList.contains('label-info') ? e.target : e.target.parentNode;
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
            ids.push(parseInt(labelInfo.dataset.id));
        });

        props.selectLabels(ids);
    }


    return (
        <div className="label-list" ref={refLabelList}>
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


