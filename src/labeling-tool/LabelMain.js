import { _props, _setScale } from '../components/LabelBoard';
import { LABEL_SELECT_MODE, LABEL_CREATE_MODE } from '../modules/annotator';
import { parseTransform, throttle, pauseEvent } from '../asset/js/common';
import { initializeLabel, createLabel, createInputBox, createAnchors, labelBodyMouseDownEvent } from './LabelCreator';
import { hideDefaultContextmenu, hideContextmenu, buildContextmenu, showContextmenu } from './LabelMenu';
import labelNS from './labelNS';


export const initialize = () => {
    console.log('initializing');

    document.addEventListener('keydown', documentKeydownEvent);
    document.addEventListener('keyup', documentKeyupEvent);
    document.addEventListener('mouseup', documentMouseupEvent);
    document.addEventListener("click", hideContextmenu);
    document.addEventListener("mousewheel", hideContextmenu);
    document.addEventListener("contextmenu", hideDefaultContextmenu);
    document.addEventListener('mousemove', pauseEvent);

    labelNS.svg = document.querySelector('#svg');
    labelNS.svg.addEventListener('mousedown', svgMousedownEvent);
    labelNS.svg.addEventListener('mousemove', throttle(svgMousemoveEvent, 25));
    labelNS.svg.addEventListener('mousewheel', throttle(svgMousewheelEvent, 40));
    labelNS.svg.addEventListener("contextmenu", showContextmenu);

    buildContextmenu();

    document.querySelector('.scaler-range').addEventListener('change', imgScaleSliderEvent);

    let labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));
    labelNS.curId = !labels.length ? 0 : parseInt(labels[labels.length - 1].id) + 1;
    Object.freeze(labelNS.menuNm);
    Object.freeze(labelNS.tagNm);
}


export const finalize = () => {
    console.log('finalizing');
    document.removeEventListener('keydown', documentKeydownEvent);
    document.removeEventListener('keyup', documentKeyupEvent);
    document.removeEventListener('mouseup', documentMouseupEvent);
    document.removeEventListener("click", hideContextmenu);
    document.removeEventListener("mousewheel", hideContextmenu);
    document.removeEventListener("contextmenu", hideDefaultContextmenu);
    document.removeEventListener('mousemove', pauseEvent);
}


export const getMode = () => {
    return labelNS.mode;
}


export const setMode = _mode => {
    labelNS.mode = _mode;

    let labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));
    labels.forEach(label => {
        labelNS.mode === LABEL_SELECT_MODE ? label.firstChild.setAttribute('cursor', 'move') : label.firstChild.setAttribute('cursor', 'auto');
    });

    labelNS.selectedLabel = null;
    deleteAnchors();
}


export const createAnchorsInSelectedLabelsIds = _ids => {
    deleteAnchors();
    let labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));
    labels.forEach(label => {
        if (_ids.includes(parseInt(label.dataset.id))) {
            createAnchors(label);
        }
    });
}


const documentKeydownEvent = e => {
    console.log('keydown');

    if (labelNS.isWritingTxt) {
        return;
    }

    let key = 'which' in e ? e.which : e.keyCode;

    if (key === 32) { // spacebar
        labelNS.isPushingSpacebar = true;
    }
    if (key === 46 || key === 8) { // delete or backspace
        deleteSelectedLabels();
    }
    if (e.ctrlKey && key === 88) { // ctrl + x
        copySelectedLabels();
        deleteSelectedLabels();
    }
    if (e.ctrlKey && key === 67) { // ctrl + c
        copySelectedLabels();
    }
    if (e.ctrlKey && key === 86) { // ctrl + v
        pasteCopiedLabels(false);
    }
}


const documentKeyupEvent = e => {
    let key = 'which' in e ? e.which : e.keyCode;

    if (key === 32) {
        labelNS.isPushingSpacebar = false;
    }
}


const svgMousedownEvent = e => {
    console.log('svg mousedown');

    if (labelNS.isPushingSpacebar) {
        labelNS.isDragging = true;
        initImgForDrag(e);
    }
    else if (labelNS.mode === LABEL_CREATE_MODE) {
        // 마우스 왼쪽 클릭이 아니면
        if (e.button !== 0) {
            return;
        }
        labelNS.isDrawing = true;
        initializeLabel(e);
    }
    else if (labelNS.mode === LABEL_SELECT_MODE) {
        let selectedLabels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('selected'));
        if (!selectedLabels.length) {
            return;
        }
        deleteAnchors(e);
        _props.selectLabels(getSelectedLabelsIds());
    }
}


const svgMousemoveEvent = e => {
    if (labelNS.isDragging && labelNS.isPushingSpacebar) {
        moveImgAndLabels(e);
    }
    else if (labelNS.isDrawing && labelNS.mode === LABEL_CREATE_MODE) {
        drawLabel(e);
    }
    else if (labelNS.isDragging && labelNS.mode === LABEL_SELECT_MODE) {
        dragLabel(e);
    }
}


const documentMouseupEvent = e => {
    console.log('document mouseup');

    if (labelNS.isDragging && labelNS.isPushingSpacebar) {
        let labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));
        _props.updateImgLabels(document.querySelector('#img'), labels);
    }
    else if (labelNS.isDrawing && labelNS.mode === LABEL_CREATE_MODE) {
        if (createLabel()) {
            _props.createLabels([labelNS.curLabel]);
        }
    }
    else if (labelNS.isDragging && labelNS.mode === LABEL_SELECT_MODE) {
        let labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));
        _props.updateLabels(labels, getSelectedLabelsIds());
    }

    labelNS.isDrawing = false;
    labelNS.isDragging = false;
}


const svgMousewheelEvent = e => {
    console.log('svgMousewheelEvent');
    e.preventDefault();

    if ((labelNS.curScale <= 0.1 && e.deltaY > 0) || (labelNS.curScale >= 2 && e.deltaY < 0)) {
        return;
    }

    let preScale = labelNS.curScale;
    labelNS.curScale = e.deltaY > 0 ? parseFloat((labelNS.curScale - 0.1).toFixed(1)) : parseFloat((labelNS.curScale + 0.1).toFixed(1));

    let scaler = document.querySelector('.scaler-range');
    scaler.style.background = 'linear-gradient(to right, #333333 0%, #333333 ' + labelNS.curScale * 50 + '%, #dedede ' + labelNS.curScale * 50 + '%, #dedede 100%)';
    _setScale(labelNS.curScale);

    controlZoom(preScale);
}


export const editLabelName = () => {
    let child = labelNS.curLabel.firstChild;
    while (child) {
        if (child.tagName === labelNS.tagNm.FOREIGNOBJECT) {
            labelNS.contextmenu.style.display = 'none';
            return;
        }
        child = child.nextSibling;
    }
    createInputBox(labelNS.curLabel.firstChild);
}


export const copySelectedLabels = () => {
    labelNS.cloneLabels = [];
    let selectedLabels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('selected'));
    for (let label of selectedLabels) {
        labelNS.cloneLabels.push(label.cloneNode(true));
    }
}


export const pasteCopiedLabels = isClickedMenu => {
    if (!labelNS.cloneLabels.length) {
        return;
    }

    let movedX;
    let movedY;

    if (isClickedMenu) {
        let standard = parseTransform(labelNS.cloneLabels[0]);
        movedX = labelNS.menuX - standard.x;
        movedY = labelNS.menuY - standard.y;
    }
    else {
        movedX = 10;
        movedY = 10;
    }

    for (let i = 0; i < labelNS.cloneLabels.length; i++) {
        const { x, y, deg, rotX, rotY } = parseTransform(labelNS.cloneLabels[i]);

        labelNS.cloneLabels[i].setAttribute('transform', 'translate(' + (x + movedX) + ' ' + (y + movedY) + ') scale(' + labelNS.curScale + ') rotate(' + deg + ' ' + rotX + ' ' + rotY + ')');
        labelNS.cloneLabels[i].dataset.id = labelNS.curId++;
        labelNS.cloneLabels[i].firstChild.addEventListener('mousedown', labelBodyMouseDownEvent);

        labelNS.svg.appendChild(labelNS.cloneLabels[i]);

        labelNS.cloneLabels[i] = labelNS.cloneLabels[i].cloneNode(true);
    }
    _props.createLabels(labelNS.cloneLabels);
}


export const deleteSelectedLabels = () => {
    let selectedLabels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('selected'));

    if (!selectedLabels.length) {
        return;
    }

    let deletedIds = [];

    for (let label of selectedLabels) {
        deletedIds.push(parseInt(label.dataset.id));
        labelNS.svg.removeChild(label);
    }

    _props.deleteLabels(deletedIds);
}


function imgScaleSliderEvent() {
    let val = parseFloat(this.value);

    if (labelNS.curScale === val) {
        return;
    }

    let preScale = labelNS.curScale;
    labelNS.curScale = val;

    controlZoom(preScale);
}


const controlZoom = preScale => {
    let img = document.querySelector('#img');
    const imgTf = parseTransform(img);
    img.setAttribute('transform', 'translate(' + imgTf.x + ' ' + imgTf.y + ') scale(' + labelNS.curScale + ')');

    let labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));

    labels.forEach(label => {
        const { x, y, deg, rotX, rotY } = parseTransform(label);
        let newX = parseFloat(((((x - imgTf.x) / preScale) * labelNS.curScale) + imgTf.x).toFixed(2));
        let newY = parseFloat(((((y - imgTf.y) / preScale) * labelNS.curScale) + imgTf.y).toFixed(2));
        label.setAttribute('transform', 'translate(' + newX + ' ' + newY + ') scale(' + labelNS.curScale + ') rotate(' + deg + ' ' + rotX + ' ' + rotY + ')');
    });

    _props.updateImgLabels(img, labels);
}


const initImgForDrag = e => {
    labelNS.startX = e.offsetX;
    labelNS.startY = e.offsetY;

    const imgTf = parseTransform(document.querySelector('#img'));
    labelNS.preX = imgTf.x;
    labelNS.preY = imgTf.y;

    let infos = [];
    let labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));
    labels.forEach(label => {
        const { x, y, deg, rotX, rotY } = parseTransform(label);
        infos.push({ id: parseInt(label.dataset.id), preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY });
    })
    labelNS.allLabelsInfo = infos;
}


const moveImgAndLabels = e => {
    let endX = e.offsetX;
    let endY = e.offsetY;
    let imgX = labelNS.preX + endX - labelNS.startX;
    let imgY = labelNS.preY + endY - labelNS.startY;
    document.querySelector('#img').setAttribute('transform', 'translate(' + imgX + ' ' + imgY + ') scale(' + labelNS.curScale + ')');

    let labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));
    labels.forEach(label => {
        let info = labelNS.allLabelsInfo.find(_label => parseInt(_label.id) === parseInt(label.dataset.id));
        let labelX = (info.preX + endX - labelNS.startX).toFixed(2);
        let labelY = (info.preY + endY - labelNS.startY).toFixed(2);
        label.setAttribute('transform', 'translate(' + labelX + ' ' + labelY + ') scale(' + labelNS.curScale + ') rotate(' + info.preDegree + ' ' + info.preRotX + ' ' + info.preRotY + ')');
    });
}


const drawLabel = e => {
    let endX = e.offsetX;
    let endY = e.offsetY;
    let x = labelNS.startX < endX ? labelNS.startX : endX;
    let y = labelNS.startY < endY ? labelNS.startY : endY;
    let width = labelNS.startX > endX ? labelNS.startX - endX : endX - labelNS.startX;
    let height = labelNS.startY > endY ? labelNS.startY - endY : endY - labelNS.startY;

    labelNS.curLabel.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + labelNS.curScale + ') rotate(0 ' + (width / labelNS.curScale) * .5 + ' ' + (height / labelNS.curScale) * .5 + ')');
    labelNS.curLabel.firstChild.setAttribute('width', parseFloat((width / labelNS.curScale).toFixed(2)));
    labelNS.curLabel.firstChild.setAttribute('height', parseFloat((height / labelNS.curScale).toFixed(2)));
}


const dragLabel = e => {
    let endX = e.offsetX;
    let endY = e.offsetY;
    let x;
    let y;
    let w;
    let h;
    let qp_x;
    let qp_y;
    let labelBody = labelNS.curLabel.firstChild;

    switch (labelNS.selectedHandler) {
        case labelNS.LABEL_RESIZE:
            if (labelNS.anchor === labelNS.CURSOR_LIST[1] || labelNS.anchor === labelNS.CURSOR_LIST[5]) {
                qp_x = labelNS.qp0_x;
                qp_y = labelNS.qp0_y + (endY - labelNS.qp0_y);
            }
            else if (labelNS.anchor === labelNS.CURSOR_LIST[3] || labelNS.anchor === labelNS.CURSOR_LIST[7]) {
                qp_x = labelNS.qp0_x + (endX - labelNS.qp0_x);
                qp_y = labelNS.qp0_y;
            }
            else {
                qp_x = labelNS.qp0_x + (endX - labelNS.qp0_x);
                qp_y = labelNS.qp0_y + (endY - labelNS.qp0_y);
            }

            let cp_x = (qp_x + labelNS.pp_x) * .5;
            let cp_y = (qp_y + labelNS.pp_y) * .5;

            let mtheta = (-1 * Math.PI * labelNS.preDegree) / 180;
            let cos_mt = Math.cos(mtheta);
            let sin_mt = Math.sin(mtheta);

            let q_x = ((qp_x - cp_x) * cos_mt - (qp_y - cp_y) * sin_mt) + cp_x;
            let q_y = ((qp_x - cp_x) * sin_mt + (qp_y - cp_y) * cos_mt) + cp_y;
            let p_x = ((labelNS.pp_x - cp_x) * cos_mt - (labelNS.pp_y - cp_y) * sin_mt) + cp_x;
            let p_y = ((labelNS.pp_x - cp_x) * sin_mt + (labelNS.pp_y - cp_y) * cos_mt) + cp_y;

            if (labelNS.anchor === labelNS.CURSOR_LIST[1] || labelNS.anchor === labelNS.CURSOR_LIST[5]) {
                w = labelNS.preWidth;
                h = p_y - q_y;
                x = labelNS.preX;
                y = q_y;
            }
            else if (labelNS.anchor === labelNS.CURSOR_LIST[3] || labelNS.anchor === labelNS.CURSOR_LIST[7]) {
                w = p_x - q_x;
                h = labelNS.preHeight;
                x = q_x;
                y = labelNS.preY;
            }
            else {
                w = p_x - q_x;
                h = p_y - q_y;
                x = q_x;
                y = q_y;
            }

            if (w < 0) {
                w *= -1;
                x = p_x;
            }
            if (h < 0) {
                h *= -1;
                y = p_y;
            }

            w /= labelNS.curScale;
            h /= labelNS.curScale;

            x = parseFloat(x.toFixed(2));
            y = parseFloat(y.toFixed(2));
            w = parseFloat(w.toFixed(2));
            h = parseFloat(h.toFixed(2));
            let rotX = parseFloat((w * .5).toFixed(2));
            let rotY = parseFloat((h * .5).toFixed(2));

            labelNS.curLabel.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + labelNS.curScale + ') rotate(' + labelNS.preDegree + ' ' + rotX + ' ' + rotY + ')');
            labelBody.setAttribute('width', w);
            labelBody.setAttribute('height', h);
            break;
        case labelNS.LABEL_BODY:
            let selectedLabels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('selected'));
            selectedLabels.forEach(label => {
                let info = labelNS.selectedLabelsInfo.find(selLabel => parseInt(selLabel.id) === parseInt(label.dataset.id));
                x = (info.preX + endX - labelNS.startX).toFixed(2);
                y = (info.preY + endY - labelNS.startY).toFixed(2);
                label.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + labelNS.curScale + ') rotate(' + info.preDegree + ' ' + info.preRotX + ' ' + info.preRotY + ')');
            });
            break;
        case labelNS.LABEL_ROTATOR:
            let oriRotX = parseFloat(labelNS.curLabel.firstChild.getAttribute('width')) * labelNS.curScale * 0.5;
            let oriRotY = parseFloat(labelNS.curLabel.firstChild.getAttribute('height')) * labelNS.curScale * 0.5;
            let degree = (Math.atan2(endY - (labelNS.preY + oriRotY), endX - (labelNS.preX + oriRotX)) * 180 / Math.PI) + 90;
            degree = degree < 0 ? degree + 360 : degree;
            degree = parseInt(degree);
            labelNS.curLabel.setAttribute('transform', 'translate(' + labelNS.preX + ' ' + labelNS.preY + ') scale(' + labelNS.curScale + ') rotate(' + degree + ' ' + labelNS.preRotX + ' ' + labelNS.preRotY + ')');
            break;
    }
    updateAnchors(labelBody);
}


const updateAnchors = labelBody => {
    const width = parseFloat(labelBody.getAttribute('width'));
    const height = parseFloat(labelBody.getAttribute('height'));

    let anchorPosXList = [-7, width * .5 - 5, width - 3, width - 3, width - 3, width * .5 - 5, -7, -7];
    let anchorPosYList = [-7, -7, -7, height * .5 - 5, height - 3, height - 3, height - 3, height * .5 - 5];

    let i = 0;
    while (labelBody.nextSibling) {
        labelBody = labelBody.nextSibling;

        switch (labelBody.tagName) {
            case labelNS.tagNm.LINE:
                labelBody.setAttribute('x1', width * .5);
                labelBody.setAttribute('x2', width * .5);
                break;
            case labelNS.tagNm.CIRCLE:
                labelBody.setAttribute('cx', width * .5);
                break;
            case labelNS.tagNm.RECT:
                if (labelBody.classList.contains('infoBox')) {
                    labelBody.setAttribute('x', width + 23);
                    labelBody.setAttribute('y', height + 5);
                }
                else {
                    labelBody.setAttribute('x', anchorPosXList[i]);
                    labelBody.setAttribute('y', anchorPosYList[i]);
                    i++;
                }
                break;
            case labelNS.tagNm.TEXT:
                labelBody.setAttribute('y', height + 5);
                for (let tspan of labelBody.childNodes) {
                    tspan.setAttribute('x', width + 30);
                }
                break;
            case labelNS.tagNm.FOREIGNOBJECT:
                labelBody.setAttribute('x', width + 20);
                break;
        }
    }
}


export const deleteAnchors = e => {
    console.log('deleteAnchors\nmode: ', labelNS.mode);

    if (e && e.ctrlKey) {
        labelNS.selectedLabel = null;
        return;
    }

    let selectedLabels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('selected'));
    selectedLabels.forEach(label => {
        if (label === labelNS.selectedLabel) {
            return true;
        }

        label.classList.remove('selected');

        for (let i = label.childNodes.length - 1; i > 0; i--) {
            label.removeChild(label.childNodes[i]);
        }
    });

    // 선택된 라벨이 하나도 선택된게 없는 상태
    if (!labelNS.selectedLabel) {
        labelNS.selectedLabelsInfo = [];
    }// 라벨이 한개만 선택된 상태
    else {
        const { x, y, deg, rotX, rotY } = parseTransform(labelNS.selectedLabel);
        labelNS.selectedLabelsInfo = [{ id: parseInt(labelNS.selectedLabel.dataset.id), preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY }];
    }

    labelNS.selectedLabel = null;
}


export const getSelectedLabelsIds = () => {
    let selectedLabelsIds = [];

    let selectedLabels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('selected'));
    selectedLabels.forEach(label => {
        selectedLabelsIds.push(parseInt(label.dataset.id));
    });

    return selectedLabelsIds;
}