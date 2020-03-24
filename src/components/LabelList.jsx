import React, {useState, useEffect} from 'react';
import * as label from '../label';

export default function LabelList(props) {
    const [ids, setIds] = useState([{}]);

    useEffect(() => {
        console.log('LabelList useEffect');

        if(props.labels == undefined || props.labels.length === 0){
            return;
        }

        let labelListRoot = document.querySelector('.label-list-root');

        let labelList = '';

        console.log(props.labels);

        props.labels.forEach(label => {
            let find = false;

            console.log(props.selectedLabelIds);

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
                id="${label.id}"
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
    });

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
            controller.style.width = '300px';
            img.src = require('../asset/images/arrow-left.png');
            labelList.style.display = 'block';
        }
    };
    
    const selectLabel = e => {
        console.log(e.ctrlKey);

        let _labelInfo;
        e.target.classList.value === 'label-info' ? _labelInfo = e.target : _labelInfo = e.target.parentNode;
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
            ids.push(labelInfo.id);
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
            <ul className="label-list-root" style={{display:'block'}} onClick={selectLabel}>
            </ul>
        </div>
    );
}
