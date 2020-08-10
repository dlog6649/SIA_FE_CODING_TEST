import React, { useEffect, useRef } from 'react';
import { LABEL_CREATE_MODE } from '../modules/annotator';


const compareIds = (_ids: Array<number | string>) => {
    let ids = [] as Array<number>;
    document.querySelectorAll('.label-info.active').forEach((labelInfo) => {
        const info: HTMLElement = labelInfo as HTMLElement;
        ids.push(Number(info.dataset.id));
    });
    if (ids.length !== _ids.length) {
        return false;
    }
    for (let i = 0; i < _ids.length; i++) {
        if (Number(_ids[i]) !== Number(ids[i])) {
            return false;
        }
    }
    return true;
}

interface Label {
    id: number, 
    name: string, 
    coordinates: Array<{x:number, y: number}>, 
    data: {x: number, y: number, w: number, h: number, deg: number}
}

interface Props {
    mode: string;
    labels: Array<Label>;
    selectedLabelsIds: Array<number>;
    selectLabels: (selectedLabelsIds: Array<number>) => void;
}

export default function LabelList(props: Props) {
    const refLabelList: React.MutableRefObject<any> = useRef(null);

    useEffect(() => {
        console.log('LabelList useEffect [props.labels]');
        let labels = props.labels;
        if (!labels) {
            labels = [] as Array<Label>;
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
                        (${Number(label.coordinates[0].x)}, ${Number(label.coordinates[0].y)})
                        (${Number(label.coordinates[1].x)}, ${Number(label.coordinates[1].y)})
                        (${Number(label.coordinates[2].x)}, ${Number(label.coordinates[2].y)})
                        (${Number(label.coordinates[3].x)}, ${Number(label.coordinates[3].y)})
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

        document.querySelectorAll('.label-info').forEach((labelInfo) => {
            const info: HTMLElement = labelInfo as HTMLElement
            info.classList.remove('active');

            props.selectedLabelsIds.forEach(id => {
                if(Number(info.dataset.id) === Number(id)) {
                    info.classList.add('active');
                }
            });
        });

    }, [props.selectedLabelsIds]);


    const toggleLabelList = () => {
        let controller = document.querySelector('.label-list-controller') as HTMLElement;
        let img = document.querySelector('.label-list-btn-img') as HTMLImageElement;
        let labelListRoot = document.querySelector('.label-list-root') as HTMLElement;

        if (labelListRoot.style.display === 'block') {
            (controller.firstChild as HTMLElement).style.display = 'none';
            controller.style.minWidth = '38px';
            controller.style.borderRight = '1px solid lightgray';
            img.src = require('../asset/images/arrow-right.png');
            labelListRoot.style.display = 'none';
            (labelListRoot.parentNode as HTMLElement).style.borderRight = 'none';
        }
        else {
            (controller.firstChild as HTMLElement).style.display = 'block';
            controller.style.minWidth = '300px';
            controller.style.borderRight = 'none';
            img.src = require('../asset/images/arrow-left.png');
            labelListRoot.style.display = 'block';
            (labelListRoot.parentNode as HTMLElement).style.borderRight = '1px solid lightgray';
        }
    };
    

    const selectLabel = (e: any): void => {
        if(props.mode === LABEL_CREATE_MODE) {
            return;
        }
        
        let _labelInfo: HTMLElement;
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

        let ids: number[] = [];
        document.querySelectorAll('.label-info.active').forEach(labelInfo => {
            const info: HTMLElement = labelInfo as HTMLElement
            ids.push(parseInt(info.dataset.id as string));
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


