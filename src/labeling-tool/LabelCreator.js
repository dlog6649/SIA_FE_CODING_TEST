import { _props } from '../components/LabelBoard';
import { LABEL_SELECT_MODE, LABEL_CREATE_MODE } from '../modules/annotator';
import { parseTransform } from '../util/common';
import * as LabelMain from './LabelMain';
import labelNS from './labelNS';


export const redrawImage = (url, image) => {
    if (document.querySelector("#img")) {
        labelNS.svg.removeChild(document.querySelector("#img"));
    }
    if (!image) {
        return;
    }

    labelNS.curScale = parseFloat(image.scale);

    let img = document.createElementNS(labelNS.svgNS, 'image');
    img.setAttribute('transform', 'translate(' + image.x + ' ' + image.y + ') scale(' + labelNS.curScale + ')');
    img.setAttribute('href', url);
    img.setAttribute('alt', 'sampleImg');
    img.id = 'img';
    img.dataset.testid = 'testImg';

    labelNS.svg.appendChild(img);
}


export const redrawLabels = labels => {
    let _labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));
    _labels.forEach(_label => {
        labelNS.svg.removeChild(_label);
    });
    if (!labels) {
        return;
    }

    labelNS.curId = !labels.length ? 0 : parseInt(labels[labels.length - 1].id) + 1;

    labels.forEach(label => {
        let x = label.data.x;
        let y = label.data.y;
        let width = label.data.w;
        let height = label.data.h;
        let deg = label.data.deg;

        let newLabel = document.createElementNS(labelNS.svgNS, "g");
        newLabel.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + labelNS.curScale + ') rotate(' + deg + ' ' + width * .5 + ' ' + height * .5 + ')');
        newLabel.classList.add('label');
        newLabel.dataset.id = label.id;
        newLabel.dataset.name = label.name;
        newLabel.dataset.testid = 'testLabel';

        let labelBody = document.createElementNS(labelNS.svgNS, "rect");
        labelBody.setAttribute('width', width);
        labelBody.setAttribute('height', height);
        labelBody.setAttribute('fill', '#5c6dda');
        labelBody.setAttribute('fill-opacity', '0.2');
        labelBody.setAttribute('stroke', '#5c6dda');
        labelBody.setAttribute('stroke-width', 3);
        labelBody.addEventListener('mousedown', labelBodyMouseDownEvent);

        if (labelNS.mode === LABEL_SELECT_MODE) {
            labelBody.setAttribute('cursor', 'move');
        }

        newLabel.appendChild(labelBody);
        labelNS.svg.appendChild(newLabel);
    });
}


export const initializeLabel = e => {
    labelNS.startX = e.offsetX;
    labelNS.startY = e.offsetY;

    labelNS.curLabel = document.createElementNS(labelNS.svgNS, "g");
    labelNS.curLabel.setAttribute('transform', 'translate(' + labelNS.startX + ' ' + labelNS.startY + ') scale(' + labelNS.curScale + ') rotate(0 0 0)');
    labelNS.curLabel.classList.add('label');

    let labelBody = document.createElementNS(labelNS.svgNS, "rect");
    labelBody.setAttribute('width', 0);
    labelBody.setAttribute('height', 0);
    labelBody.setAttribute('fill', '#5c6dda');
    labelBody.setAttribute('fill-opacity', '0.2');
    labelBody.setAttribute('stroke', '#5c6dda');
    labelBody.setAttribute('stroke-width', 3);
    labelBody.addEventListener('mousedown', labelBodyMouseDownEvent);

    labelNS.curLabel.appendChild(labelBody);
    labelNS.svg.appendChild(labelNS.curLabel);
}


export const labelBodyMouseDownEvent = e => {
    if (e.button !== 0 && e.button !== 2) {
        return;
    }

    labelNS.curLabel = e.target.parentNode;

    if (labelNS.mode === LABEL_CREATE_MODE || labelNS.isPushingSpacebar) {
        return;
    }

    console.log('labelBodyMouseDownEvent');
    e.stopPropagation();

    labelNS.isDragging = true;
    labelNS.curLabel = labelNS.selectedLabel = e.target.parentNode;
    labelNS.selectedHandler = labelNS.LABEL_BODY;

    labelNS.startX = e.offsetX;
    labelNS.startY = e.offsetY;

    if (labelNS.curLabel.childNodes.length < 3) {
        createAnchors(labelNS.curLabel);
    }
    LabelMain.deleteAnchors(e);

    // 선택된 레이블들의 이전 정보 세팅
    let infos = [];
    let selectedLabels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('selected'));
    selectedLabels.forEach(label => {
        const { x, y, deg, rotX, rotY } = parseTransform(label);
        infos.push({ id: parseInt(label.dataset.id), preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY });
    });
    labelNS.selectedLabelsInfo = infos;
}


export const createLabel = () => {
    let labelBody = labelNS.curLabel.firstChild;

    if (labelBody.getAttribute('width') < 10 && labelBody.getAttribute('height') < 10) {
        labelNS.svg.removeChild(labelNS.curLabel);
        return false;
    }

    labelNS.curLabel.dataset.id = labelNS.curId++;
    labelNS.curLabel.dataset.name = '';
    labelNS.curLabel.dataset.testid = 'testLabel';

    createInputBox(labelBody);

    return true;
}


export const createInputBox = labelBody => {
    let width = parseFloat(labelBody.getAttribute('width'));

    let inputWrapper = document.createElementNS(labelNS.svgNS, "foreignObject");
    inputWrapper.setAttribute('x', width + 20);
    inputWrapper.setAttribute('y', 0);
    inputWrapper.setAttribute('width', '145');
    inputWrapper.setAttribute('height', '30');

    let input = document.createElement("input");
    input.classList.add('label-input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Input Class name');
    if (labelBody.parentNode.dataset.name) {
        input.setAttribute('value', labelBody.parentNode.dataset.name);
    }
    input.addEventListener('mousemove', e => {
        e.stopPropagation();
    });
    input.addEventListener('mousedown', e => {
        e.stopPropagation();
    });
    input.addEventListener('focus', e => {
        labelNS.isWritingTxt = true;
    });
    input.addEventListener('focusout', e => {
        labelNS.isWritingTxt = false;
    });
    input.addEventListener('keydown', e => {
        if (e.keyCode === 13) {
            labelBody.parentNode.dataset.name = e.target.value;
            labelBody.parentNode.removeChild(inputWrapper);
            let labels = [...labelNS.svg.childNodes].filter(node => node.classList.contains('label'));
            _props.updateLabels(labels, LabelMain.getSelectedLabelsIds());
        }
    });
    inputWrapper.appendChild(input);
    labelBody.parentNode.appendChild(inputWrapper);
}


export const createAnchors = label => {
    label.classList.add('selected');

    let width = parseFloat(label.firstChild.getAttribute('width'));
    let height = parseFloat(label.firstChild.getAttribute('height'));

    let line = document.createElementNS(labelNS.svgNS, "line");
    line.setAttribute('x1', width * .5);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', width * .5);
    line.setAttribute('y2', -25);
    line.setAttribute('stroke', '#5c6dda');
    line.setAttribute('stroke-width', 3);
    label.appendChild(line);

    let circle = document.createElementNS(labelNS.svgNS, "circle");
    circle.setAttribute('cx', width * .5);
    circle.setAttribute('cy', -25);
    circle.setAttribute('r', 5);
    circle.setAttribute('cursor', 'Crosshair');
    circle.setAttribute('fill', 'white');
    circle.setAttribute('stroke', '#5c6dda');
    circle.setAttribute('stroke-width', 3);
    circle.addEventListener('mousedown', e => {
        if (e.button !== 0 && e.button !== 2) {
            return;
        }

        labelNS.curLabel = e.target.parentNode;

        if (labelNS.mode === LABEL_CREATE_MODE || labelNS.isPushingSpacebar) {
            return;
        }

        console.log('anchor mousedown');
        e.stopPropagation();

        labelNS.isDragging = true;
        labelNS.curLabel = labelNS.selectedLabel = e.target.parentNode;
        labelNS.selectedHandler = labelNS.LABEL_ROTATOR;

        labelNS.startX = e.offsetX;
        labelNS.startY = e.offsetY;

        const { x, y, deg, rotX, rotY } = parseTransform(labelNS.curLabel);
        labelNS.preX = x;
        labelNS.preY = y;
        labelNS.preDegree = deg;
        labelNS.preRotX = rotX;
        labelNS.preRotY = rotY;

        LabelMain.deleteAnchors(e);
    });

    label.appendChild(circle);

    const anchorPosXList = [-7, width * .5 - 5, width - 3, width - 3, width - 3, width * .5 - 5, -7, -7];
    const anchorPosYList = [-7, -7, -7, height * .5 - 5, height - 3, height - 3, height - 3, height * .5 - 5];

    for (let i = 0; i < 8; i++) {
        let anchor = document.createElementNS(labelNS.svgNS, "rect");
        anchor.setAttribute('x', anchorPosXList[i]);
        anchor.setAttribute('y', anchorPosYList[i]);
        anchor.setAttribute('cursor', labelNS.CURSOR_LIST[i]);
        anchor.setAttribute('width', 10);
        anchor.setAttribute('height', 10);
        anchor.setAttribute('fill', 'white');
        anchor.setAttribute('stroke', '#5c6dda');
        anchor.setAttribute('stroke-width', 3);
        anchor.addEventListener('mousedown', e => {
            if (e.button !== 0 && e.button !== 2) {
                return;
            }

            labelNS.curLabel = e.target.parentNode;

            if (labelNS.mode === LABEL_CREATE_MODE || labelNS.isPushingSpacebar) {
                return;
            }

            console.log('anchor mousedown');
            e.stopPropagation();

            labelNS.isDragging = true;
            labelNS.curLabel = labelNS.selectedLabel = e.target.parentNode;
            labelNS.selectedHandler = labelNS.LABEL_RESIZE;
            labelNS.anchor = labelNS.CURSOR_LIST[i];

            const { x, y, deg, rotX, rotY, w, h } = parseTransform(labelNS.curLabel);
            labelNS.preX = x;
            labelNS.preY = y;
            labelNS.preDegree = deg;
            labelNS.preRotX = rotX;
            labelNS.preRotY = rotY;
            labelNS.preWidth = parseFloat((w * labelNS.curScale).toFixed(2));
            labelNS.preHeight = parseFloat((h * labelNS.curScale).toFixed(2));

            let theta = (Math.PI / 180) * deg;
            let cos_t = Math.cos(theta);
            let sin_t = Math.sin(theta);

            let c0_x = x + rotX * labelNS.curScale;
            let c0_y = y + rotY * labelNS.curScale;

            let rightSide = x + labelNS.preWidth;
            let bottomSide = y + labelNS.preHeight;

            let q0_x_arr = [x, c0_x, rightSide, rightSide, rightSide, c0_x, x, x];
            let q0_y_arr = [y, y, y, c0_y, bottomSide, bottomSide, bottomSide, c0_y];
            let p0_x_arr = [rightSide, c0_x, x, x, x, c0_x, rightSide, rightSide];
            let p0_y_arr = [bottomSide, bottomSide, bottomSide, c0_y, y, y, y, c0_y];

            let q0_x = q0_x_arr[i];
            let q0_y = q0_y_arr[i];

            let p0_x = p0_x_arr[i];
            let p0_y = p0_y_arr[i];

            labelNS.qp0_x = (q0_x - c0_x) * cos_t - (q0_y - c0_y) * sin_t + c0_x;
            labelNS.qp0_y = (q0_x - c0_x) * sin_t + (q0_y - c0_y) * cos_t + c0_y;

            labelNS.pp_x = (p0_x - c0_x) * cos_t - (p0_y - c0_y) * sin_t + c0_x;
            labelNS.pp_y = (p0_x - c0_x) * sin_t + (p0_y - c0_y) * cos_t + c0_y;

            LabelMain.deleteAnchors(e);
        });

        label.appendChild(anchor);
    }

    let nameLen = 0;
    if (label.dataset.name) {
        nameLen = label.dataset.name.length;
        nameLen *= 5;
    }

    let infoBox = document.createElementNS(labelNS.svgNS, "rect");
    infoBox.setAttribute('x', width + 23);
    infoBox.setAttribute('y', height + 5);
    infoBox.setAttribute('rx', 5);
    infoBox.setAttribute('ry', 5);
    infoBox.setAttribute('width', 70 + nameLen);
    if (!label.dataset.name) {
        infoBox.setAttribute('height', 36);
    }
    else {
        infoBox.setAttribute('height', 50);
    }
    infoBox.setAttribute('fill', 'white');
    infoBox.setAttribute('filter', 'url(#f1)');
    infoBox.classList.add('infoBox');
    label.appendChild(infoBox);

    let infoTxt = document.createElementNS(labelNS.svgNS, "text");
    infoTxt.setAttribute('y', height + 5);

    let tspan0 = document.createElementNS(labelNS.svgNS, "tspan");
    tspan0.setAttribute('x', width + 30);
    tspan0.setAttribute('dy', 15);
    tspan0.setAttribute('font-size', 11);
    tspan0.setAttribute('font-weight', 600);
    tspan0.setAttribute('cursor', 'default');

    let tspan1 = document.createElementNS(labelNS.svgNS, "tspan");
    tspan1.setAttribute('x', width + 30);
    tspan1.setAttribute('dy', 15);
    tspan1.setAttribute('font-size', 10);
    tspan1.setAttribute('cursor', 'default');
    tspan1.setAttribute('draggable', 'false');

    let tspan2 = document.createElementNS(labelNS.svgNS, "tspan");
    tspan2.setAttribute('x', width + 30);
    tspan2.setAttribute('dy', 14);
    tspan2.setAttribute('font-size', 10);
    tspan2.setAttribute('cursor', 'default');

    tspan0.innerHTML = label.dataset.name;
    tspan1.innerHTML = 'W ' + width;
    tspan2.innerHTML = 'H ' + height;

    infoTxt.appendChild(tspan0);
    infoTxt.appendChild(tspan1);
    infoTxt.appendChild(tspan2);

    label.appendChild(infoTxt);
}