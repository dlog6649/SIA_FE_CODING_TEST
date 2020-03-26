import React, {useEffect} from 'react';
import { LABEL_SELECT_MODE, LABEL_CREATE_MODE } from '../modules/annotator';

export default function LabelList(props) {

    useEffect(() => {
        console.log('LabelList useEffect [props.labels]');

        let labelListRoot = document.querySelector('.label-list-root');

        if(props.labels === undefined || props.labels.length === 0) {
            while(labelListRoot.firstChild) {
                labelListRoot.removeChild(labelListRoot.firstChild);
            }
            return;
        }

        let labelList = '';

        props.labels.forEach(label => {

            let find = false;
            props.selectedLabelIds.forEach(id => {
                if(id === label.id) {
                    labelList += `<li class="label-info btn active"`;
                    find = true;
                    return false;
                }
            });

            if(!find) {
                labelList += `<li class="label-info btn"`;
            }

            // coordinates
            // 0 1
            // 3 2
            labelList += `
                data-id="${label.id}"
                data-name="${label.name}"
                data-x-coordinate0="${label.coordinates[0].x}"
                data-y-coordinate0="${label.coordinates[0].y}"
                data-x-coordinate1="${label.coordinates[1].x}"
                data-y-coordinate1="${label.coordinates[1].y}"
                data-x-coordinate2="${label.coordinates[2].x}"
                data-y-coordinate2="${label.coordinates[2].y}"
                data-x-coordinate3="${label.coordinates[3].x}"
                data-y-coordinate3="${label.coordinates[3].y}"
            >
                <p class="label-class">${label.name}</p>
                <p class="label-coordinate">
                    (${label.coordinates[0].x}, ${label.coordinates[0].y})
                    (${label.coordinates[1].x}, ${label.coordinates[1].y})
                    (${label.coordinates[2].x}, ${label.coordinates[2].y})
                    (${label.coordinates[3].x}, ${label.coordinates[3].y})
                </p>
            </li>
            `;
        });

        labelListRoot.innerHTML = labelList;

    }, [props.labels]);

    useEffect(() => {
        console.log('LabelList useEffect [props.selectedLabelIds]');

        if(compareIds(props.selectedLabelIds)) {
            console.log('LabelList useEffect [props.selectedLabelIds] returned');
            return;
        }

        console.log('props.selectedLabelIds: ',props.selectedLabelIds);

        document.querySelectorAll('.label-info').forEach(labelInfo => {
            labelInfo.classList.remove('active');

            props.selectedLabelIds.forEach(id => {
                if(labelInfo.dataset.id === id) {
                    labelInfo.classList.add('active');
                }
            });
        });

    }, [props.selectedLabelIds]);

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
            controller.style.width = '38px';
            img.src = require('../asset/images/arrow-right.png');
            labelList.style.display = 'none';
        }
        else {
            controller.firstChild.style.display = 'block';
            controller.style.width = '310px';
            img.src = require('../asset/images/arrow-left.png');
            labelList.style.display = 'block';
        }
    };
    
    const selectLabel = e => {
        if(props.mode === LABEL_CREATE_MODE) {
            return;
        }
        console.log('selectLabel');
        
        let _labelInfo;
        e.target.classList.value.indexOf('label-info') !== -1 ? _labelInfo = e.target : _labelInfo = e.target.parentNode;
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
