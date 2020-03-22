import React, {useState, useEffect} from 'react';

export default function LabelList(props) {
    const [labels, setLabels] = useState([{}]);

    useEffect(() => {
        console.log('LabelList useEffect');

        if(props.labels === undefined){
            return;
        }

        let labelListRoot = document.querySelector('.label-list-root');

        let labelList = '';
        props.labels.forEach(node => {
            labelList += `
            <li class="label-info btn" 
                data-class="${node.class}"
                data-coordinate0-x="${node.coordinate[0].x}"
                data-coordinate0-y="${node.coordinate[0].y}"
                data-coordinate1-x="${node.coordinate[1].x}"
                data-coordinate1-y="${node.coordinate[1].y}"
                data-coordinate2-x="${node.coordinate[2].x}"
                data-coordinate2-y="${node.coordinate[2].y}"
                data-coordinate3-x="${node.coordinate[3].x}"
                data-coordinate3-y="${node.coordinate[3].y}"
            >
                <p class="label-class">${node.class}</p>
                <p class="label-coordinate">
                    (${node.coordinate[0].x}, ${node.coordinate[0].y})
                    (${node.coordinate[1].x}, ${node.coordinate[1].y})
                    (${node.coordinate[2].x}, ${node.coordinate[2].y})
                    (${node.coordinate[3].x}, ${node.coordinate[3].y})
                </p>
            </li>
            `;
        });

        labelListRoot.innerHTML = labelList;
    });

    const labelListToggle = e => {
        let controller = document.querySelector('.label-list-controller');
        let img = document.querySelector('.label-list-btn-img');
        let labelList = document.querySelector('.label-list-root');

        if(labelList.style.display === 'block') {
            controller.firstChild.style.display = 'none';
            controller.style.width = '38px';
            img.src = require('../images/arrow-right.png');
            labelList.style.display = 'none';
        }
        else {
            controller.firstChild.style.display = 'block';
            controller.style.width = '300px';
            img.src = require('../images/arrow-left.png');
            labelList.style.display = 'block';
        }
    };
    
    const selectLabel = e => {
        let labelInfo;
        e.target.classList.value === 'label-info' ? labelInfo = e.target : labelInfo = e.target.parentNode;
        labelInfo.classList.toggle('active');

        let selectedLabels = [];
        document.querySelectorAll('.label-info.active').forEach(node => {
            let label = {};
            label.class = node.dataset.class;
            label.coordinate = [
                {x:node.dataset.coordinate0X, y:node.dataset.coordinate0Y}
                ,{x:node.dataset.coordinate1X, y:node.dataset.coordinate1Y}
                ,{x:node.dataset.coordinate2X, y:node.dataset.coordinate2Y}
                ,{x:node.dataset.coordinate3X, y:node.dataset.coordinate3Y}
            ];

            selectedLabels.push(label);
        });

        props.onClick(selectedLabels);
    }

    return (
        <div className="label-list">
            <div className="label-list-controller">
                <span>Labels</span>
                <button className="btn label-list-btn" onClick={labelListToggle} type="button">
                    <img className="label-list-btn-img" src={require('../images/arrow-left.png')} alt="arrow-left"/>
                </button>
            </div>
            <ul className="label-list-root" style={{display:'block'}} onClick={selectLabel}>
            </ul>
        </div>
    );
}
