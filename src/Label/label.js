import { _props, _setScale } from '../components/LabelBoard';
import { LABEL_SELECT_MODE, LABEL_CREATE_MODE } from '../modules/annotator';
import { parseTransform } from '../asset/js/common';


//   9
// 0 1 2
// 7 8 3
// 6 5 4
const CURSOR_LIST = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];
const LABEL_RESIZE = 'LABEL_RESIZE';
const LABEL_ROTATOR = 'LABEL_ROTATOR';
const LABEL_BODY = 'LABEL_BODY';
const svgNS = 'http://www.w3.org/2000/svg';
const labelNS = {
  svg: null
  ,contextmenu: null
  ,mode: LABEL_SELECT_MODE
  ,curId: 0
  ,curScale: 1.0
  ,isDrawing: false
  ,isDragging: false
  ,isPushingSpacebar: false
  ,isWritingTxt: false
  ,startX: 0
  ,startY: 0
  ,preX: 0
  ,preY: 0
  ,preDegree: 0
  ,preRotX: .0
  ,preRotY: .0
  ,preWidth: .0
  ,preHeight: .0
  ,qp0_x: .0
  ,qp0_y: .0
  ,pp_x: .0
  ,pp_y: .0
  ,menuX: 0
  ,menuY: 0
  ,curLabel: null
  ,selectedLabel: null
  ,selectedLabelsIds: []
  ,selectedLabelsInfo: []
  ,allLabelsInfo: []
  ,cloneLabels: []
  ,selectedHandler: null
  ,anchor: null
}
const menuNm = {
  EDIT: 'edit'
  ,CUT: 'cut'
  ,COPY: 'copy'
  ,PASTE: 'paste'
  ,DELETE: 'delete'
}
const tagNm = {
  LINE: 'line'
  ,CIRCLE: 'circle'
  ,RECT: 'rect'
  ,TEXT: 'text'
  ,FOREIGNOBJECT: 'foreignObject'
  ,IMAGE: 'image'
  ,G: 'g'
  ,SPAN: 'SPAN'
}


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

  let labels = document.querySelectorAll('.label');
  labelNS.curId = !labels.length ? 0 : parseInt(labels[labels.length - 1].id) + 1;
  Object.freeze(menuNm);
  Object.freeze(tagNm);
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


export const compareImage = _image => {
  if(!_image) {
    return true;
  }

  let image = document.querySelector('#img');
  if(!image) {
    return false;
  }

  const imgTf = parseTransform(image);

  if (_image.x !== imgTf.x || _image.y !== imgTf.y || _image.scale !== imgTf.scale) {
    return false;
  }
  return true;
}


export const compareLabels = _labels => {
  if (!_labels) {
    _labels = [];
  }
  console.log(_labels.length);

  let labels = document.querySelectorAll('.label');

  if (_labels.length !== labels.length) {
    return false;
  }

  for (let i = 0; i < labels.length; i++) {
    const {x, y, w, h, deg} = parseTransform(labels[i]);

    let _x = _labels[i].data.x;
    let _y = _labels[i].data.y;
    let _w = _labels[i].data.w;
    let _h = _labels[i].data.h;
    let _deg = _labels[i].data.deg;

    if (x !== _x || y !== _y || w !== _w || h !== _h || deg !== _deg) {
      return false;
    }
  }
  return true;
}


export const compareIds = (propsIds) => {
  if (labelNS.selectedLabelsIds.length !== propsIds.length) {
    return false;
  }
  for (let i = 0; i < labelNS.selectedLabelsIds.length; i++) {
    if (parseInt(labelNS.selectedLabelsIds[i]) !== parseInt(propsIds[i])) {
      return false;
    }
  }
  return true;
}


export const redrawImage = (url, image) => {
  if (document.querySelector("#img")) {
    labelNS.svg.removeChild(document.querySelector("#img"));
  }
  if (!image) {
    return;
  }

  labelNS.curScale = parseFloat(image.scale);
  
  let img = document.createElementNS(svgNS, 'image');
  img.setAttribute('transform', 'translate('+image.x+' '+image.y+') scale('+labelNS.curScale+')');
  img.setAttribute('href', url);
  img.setAttribute('alt', 'sampleImg');
  img.id = 'img';
  img.dataset.testid = 'testImg';

  labelNS.svg.appendChild(img);
}


export const redrawLabels = (labels, _selectedLabelsIds) => {
  document.querySelectorAll('.label').forEach(label => {
    labelNS.svg.removeChild(label);
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

    let newLabel = document.createElementNS(svgNS, "g");
    newLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+labelNS.curScale+') rotate('+deg+' '+width*.5+' '+height*.5+')');
    newLabel.classList.add('label');
    newLabel.dataset.id = label.id;
    newLabel.dataset.name = label.name;
    newLabel.dataset.testid = 'testLabel';

    let labelBody = document.createElementNS(svgNS, "rect");
    labelBody.setAttribute('width', width);
    labelBody.setAttribute('height', height);
    labelBody.setAttribute('fill', '#5c6dda');
    labelBody.setAttribute('fill-opacity', '0.2');
    labelBody.setAttribute('stroke', '#5c6dda');
    labelBody.setAttribute('stroke-width', 3);
    labelBody.addEventListener('mousedown', labelBodyMouseDownEvent);

    if(labelNS.mode === LABEL_SELECT_MODE) {
      labelBody.setAttribute('cursor', 'move');
    }

    newLabel.appendChild(labelBody);
    labelNS.svg.appendChild(newLabel);

    _selectedLabelsIds.forEach(id => {
      if(parseInt(newLabel.dataset.id) === parseInt(id)) {
        createAnchors(newLabel);
      }
    });
  });
}


export const getMode = () => {
  return labelNS.mode;
}


export const setSelectedLabelIds = _ids => {
  console.log('label.setIds');

  deleteAnchors();

  labelNS.selectedLabelsIds = _ids;

  labelNS.selectedLabelsIds.forEach(id => {
    document.querySelectorAll('.label').forEach(label => {
      if(parseInt(id) === parseInt(label.dataset.id)) {
        createAnchors(label);
      }
    });
  });
}


export const setMode = _mode => {
  labelNS.mode = _mode;

  document.querySelectorAll('.label').forEach(label => {
    labelNS.mode === LABEL_SELECT_MODE ? label.firstChild.setAttribute('cursor', 'move') : label.firstChild.setAttribute('cursor', 'auto');
  });
  
  labelNS.selectedLabel = null;
  deleteAnchors();
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
  
  if(key === 32) {
    labelNS.isPushingSpacebar = false;
  }
}


const svgMousedownEvent = e => {
  console.log('svg mousedown');
  
  if(labelNS.isPushingSpacebar) {
    labelNS.isDragging = true;
    initImgForDrag(e);
  }
  else if(labelNS.mode === LABEL_CREATE_MODE) {
    // 마우스 왼쪽 클릭이 아니면
    if (e.button !== 0) {
      return;
    }
    labelNS.isDrawing = true;
    initializeLabel(e);
  }
  else if(labelNS.mode === LABEL_SELECT_MODE) {
    if (!document.querySelectorAll('.selected').length) {
      return;
    }
    deleteAnchors(e);
    _props.selectLabels(updateAndGetIds());
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
    _props.updateImgLabels(document.querySelector('#img'), document.querySelectorAll('.label'));
  }
  else if (labelNS.isDrawing && labelNS.mode === LABEL_CREATE_MODE) {
    if(createLabel()) {
      _props.createLabels([labelNS.curLabel]);
    }
  }
  else if (labelNS.isDragging && labelNS.mode === LABEL_SELECT_MODE) {
    _props.updateLabels(document.querySelectorAll('.label'), updateAndGetIds());
  }
  
  labelNS.isDrawing = false;
  labelNS.isDragging = false;
}


const svgMousewheelEvent = e => {
  console.log('svgMousewheelEvent');
  e.preventDefault();
  
  if((labelNS.curScale <= 0.1 && e.deltaY > 0) || (labelNS.curScale >= 2 && e.deltaY < 0)) {
    return;
  }

  let preScale = labelNS.curScale;
  labelNS.curScale = e.deltaY > 0 ? parseFloat((labelNS.curScale - 0.1).toFixed(1)) : parseFloat((labelNS.curScale + 0.1).toFixed(1));

  let scaler = document.querySelector('.scaler-range');
  scaler.style.background = 'linear-gradient(to right, #333333 0%, #333333 ' + labelNS.curScale*50 + '%, #dedede ' + labelNS.curScale*50 + '%, #dedede 100%)';
  _setScale(labelNS.curScale);
  
  controlZoom(preScale);
}


const pauseEvent = e => {
  if(e.stopPropagation) e.stopPropagation();
  if(e.preventDefault) e.preventDefault();
  e.cancelBubble=true;
  e.returnValue=false;
  return false;
}


const hideDefaultContextmenu = e => {
  e.preventDefault();
}


const buildContextmenu = () => {
  labelNS.contextmenu = document.querySelector('.label-contextmenu');
  labelNS.contextmenu.addEventListener('click', e => {
    e.stopPropagation();

    let menu = e.target.tagName === tagNm.SPAN ? e.target.parentNode : e.target;

    switch (menu.id) {
      case menuNm.EDIT:
        editLabelName();
        break;
      case menuNm.CUT:
        copySelectedLabels();
        deleteSelectedLabels();
        break;
      case menuNm.COPY:
        copySelectedLabels();
        break;
      case menuNm.PASTE:
        pasteCopiedLabels(true);
        break;
      case menuNm.DELETE:
        deleteSelectedLabels();
        break;
    }
    labelNS.contextmenu.style.display = 'none';
  });
}


const editLabelName = () => {
  let child = labelNS.curLabel.firstChild;
  while (child) {
    if (child.tagName === tagNm.FOREIGNOBJECT) {
      labelNS.contextmenu.style.display = 'none';
      return;
    }
    child = child.nextSibling;
  }
  createInputBox(labelNS.curLabel.firstChild);
}


const hideContextmenu = () => {
  labelNS.contextmenu.style.display = 'none';
}


const showContextmenu = e => {
  e.preventDefault();

  if (labelNS.mode === LABEL_CREATE_MODE) {
    return;
  }

  labelNS.menuX = e.offsetX;
  labelNS.menuY = e.offsetY;

  labelNS.contextmenu.style.display = 'block';
  labelNS.contextmenu.style.left = e.pageX + 'px';
  labelNS.contextmenu.style.top = e.pageY + 'px';

  if (e.target.id === 'svg' || e.target.tagName === tagNm.IMAGE) {
    document.querySelector('.item.edit').style.display = 'none';
    document.querySelector('.item.cut').style.display = 'none';
    document.querySelector('.item.copy').style.display = 'none';
    document.querySelector('.item.delete').style.display = 'none';
  }
  else {
    document.querySelector('.item.edit').style.display = 'block';
    document.querySelector('.item.cut').style.display = 'block';
    document.querySelector('.item.copy').style.display = 'block';
    document.querySelector('.item.delete').style.display = 'block';
  }

  if (!labelNS.cloneLabels.length) {
    document.querySelector('.item.paste').classList.add('disabled');
  }
  else {
    document.querySelector('.item.paste').classList.remove('disabled');
  }
}


const copySelectedLabels = () => {
  labelNS.cloneLabels = [];
  for(let label of document.querySelectorAll('.selected')) {
    labelNS.cloneLabels.push(label.cloneNode(true));
  }
}


const pasteCopiedLabels = isClickedMenu => {
  if (!labelNS.cloneLabels.length) {
    return;
  }

  let transform;
  let standardX;
  let standardY;
  let movedX;
  let movedY;

  if (isClickedMenu) {
    transform = labelNS.cloneLabels[0].getAttribute('transform').split(' ');
    standardX = parseFloat(transform[0].substring(10));
    standardY = parseFloat(transform[1].split(')')[0]);
    movedX = labelNS.menuX - standardX;
    movedY = labelNS.menuY - standardY;
  }
  else {
    movedX = 10;
    movedY = 10;
  }

  for (let i = 0; i < labelNS.cloneLabels.length; i++) {
    const {x, y, deg, rotX, rotY} = parseTransform(labelNS.cloneLabels[i]);

    labelNS.cloneLabels[i].setAttribute('transform', 'translate('+(x+movedX)+' '+(y+movedY)+') scale('+labelNS.curScale+') rotate('+deg+' '+rotX+' '+rotY+')');
    labelNS.cloneLabels[i].dataset.id = labelNS.curId++;
    labelNS.cloneLabels[i].firstChild.addEventListener('mousedown', labelBodyMouseDownEvent);

    labelNS.svg.appendChild(labelNS.cloneLabels[i]);

    labelNS.cloneLabels[i] = labelNS.cloneLabels[i].cloneNode(true);
  }
  _props.createLabels(labelNS.cloneLabels);
}


const deleteSelectedLabels = () => {
  let selectedLabels = document.querySelectorAll('.selected');
  
  if(!selectedLabels.length) {
    return;
  }
  
  let deletedIds = [];

  for(let label of selectedLabels) {
    deletedIds.push(parseInt(label.dataset.id));
    labelNS.svg.removeChild(label);
  }

  _props.deleteLabels(deletedIds);
}


function imgScaleSliderEvent() {
  let val = parseFloat(this.value);
  
  if(labelNS.curScale === val) {
    return;
  }
  
  let preScale = labelNS.curScale;
  labelNS.curScale = val;

  controlZoom(preScale);
}


const controlZoom = preScale => {
  let img = document.querySelector('#img');
  const imgTf = parseTransform(img);
  img.setAttribute('transform', 'translate('+imgTf.x+' '+imgTf.y+') scale('+labelNS.curScale+')');

  let labels = document.querySelectorAll('.label');

  labels.forEach(label => {
    const {x, y, deg, rotX, rotY} = parseTransform(label);
    let newX = parseFloat(((((x - imgTf.x) / preScale) * labelNS.curScale) + imgTf.x).toFixed(2));
    let newY = parseFloat(((((y - imgTf.y) / preScale) * labelNS.curScale) + imgTf.y).toFixed(2));
    label.setAttribute('transform', 'translate('+newX+' '+newY+') scale('+labelNS.curScale+') rotate('+deg+' '+rotX+' '+rotY+')');
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
  document.querySelectorAll('.label').forEach(label => {
    const {x, y, deg, rotX, rotY} = parseTransform(label);
    infos.push({id: parseInt(label.dataset.id), preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY});
  })
  labelNS.allLabelsInfo = infos;
}


const initializeLabel = e => {
  labelNS.startX = e.offsetX;
  labelNS.startY = e.offsetY;

  labelNS.curLabel = document.createElementNS(svgNS, "g");
  labelNS.curLabel.setAttribute('transform', 'translate('+labelNS.startX+' '+labelNS.startY+') scale('+labelNS.curScale+') rotate(0 0 0)');
  labelNS.curLabel.classList.add('label');

  let labelBody = document.createElementNS(svgNS, "rect");
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


const labelBodyMouseDownEvent = e => {
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
  labelNS.selectedHandler = LABEL_BODY;

  labelNS.startX = e.offsetX;
  labelNS.startY = e.offsetY;

  if(labelNS.curLabel.childNodes.length < 3){
    createAnchors(labelNS.curLabel);
  }
  deleteAnchors(e);
  
  // 선택된 레이블들의 이전 정보 세팅
  let infos = [];
  document.querySelectorAll('.selected').forEach(label => {
    const {x, y, deg, rotX, rotY} = parseTransform(label);
    infos.push({id: parseInt(label.dataset.id), preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY});
  });
  labelNS.selectedLabelsInfo = infos;
}


const moveImgAndLabels = e => {
  let endX = e.offsetX;
  let endY = e.offsetY;
  let imgX = labelNS.preX + endX - labelNS.startX;
  let imgY = labelNS.preY + endY - labelNS.startY;
  document.querySelector('#img').setAttribute('transform', 'translate('+imgX+' '+imgY+') scale('+labelNS.curScale+')');

  document.querySelectorAll('.label').forEach(label => {
    let info = labelNS.allLabelsInfo.find(_label => parseInt(_label.id) === parseInt(label.dataset.id));
    let labelX = (info.preX + endX - labelNS.startX).toFixed(2);
    let labelY = (info.preY + endY - labelNS.startY).toFixed(2);
    label.setAttribute('transform', 'translate('+labelX+' '+labelY+') scale('+labelNS.curScale+') rotate('+info.preDegree+' '+info.preRotX+' '+info.preRotY+')');
  });
}


const drawLabel = e => {
  let endX = e.offsetX;
  let endY = e.offsetY;
  let x = labelNS.startX < endX ? labelNS.startX : endX;
  let y = labelNS.startY < endY ? labelNS.startY : endY;
  let width = labelNS.startX > endX ? labelNS.startX - endX : endX - labelNS.startX;
  let height = labelNS.startY > endY ? labelNS.startY - endY : endY - labelNS.startY;

  labelNS.curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+labelNS.curScale+') rotate(0 '+(width/labelNS.curScale)*.5+' '+(height/labelNS.curScale)*.5+')');
  labelNS.curLabel.firstChild.setAttribute('width', parseFloat((width/labelNS.curScale).toFixed(2)));
  labelNS.curLabel.firstChild.setAttribute('height', parseFloat((height/labelNS.curScale).toFixed(2)));
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
    case LABEL_RESIZE:
      if (labelNS.anchor === CURSOR_LIST[1] || labelNS.anchor === CURSOR_LIST[5]) {
        qp_x = labelNS.qp0_x;
        qp_y = labelNS.qp0_y + (endY - labelNS.qp0_y);
      }
      else if (labelNS.anchor === CURSOR_LIST[3] || labelNS.anchor === CURSOR_LIST[7]) {
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

      if (labelNS.anchor === CURSOR_LIST[1] || labelNS.anchor === CURSOR_LIST[5]) {
        w = labelNS.preWidth;
        h = p_y - q_y;
        x = labelNS.preX;
        y = q_y;
      }
      else if (labelNS.anchor === CURSOR_LIST[3] || labelNS.anchor === CURSOR_LIST[7]) {
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

      if(w < 0) {
        w *= -1;
        x = p_x;
      }
      if(h < 0) {
        h *= -1;
        y = p_y;
      }

      w /= labelNS.curScale;
      h /= labelNS.curScale;

      x = parseFloat(x.toFixed(2));
      y = parseFloat(y.toFixed(2));
      w = parseFloat(w.toFixed(2));
      h = parseFloat(h.toFixed(2));
      let rotX = parseFloat((w*.5).toFixed(2));
      let rotY = parseFloat((h*.5).toFixed(2));
      
      labelNS.curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+labelNS.curScale+') rotate('+labelNS.preDegree+' '+rotX+' '+rotY+')');
      labelBody.setAttribute('width', w);
      labelBody.setAttribute('height', h);
      break;
    case LABEL_BODY:
      document.querySelectorAll('.selected').forEach(label => {
        let info = labelNS.selectedLabelsInfo.find(selLabel => parseInt(selLabel.id) === parseInt(label.dataset.id));
        x = (info.preX + endX - labelNS.startX).toFixed(2);
        y = (info.preY + endY - labelNS.startY).toFixed(2);
        label.setAttribute('transform', 'translate('+x+' '+y+') scale('+labelNS.curScale+') rotate('+info.preDegree+' '+info.preRotX+' '+info.preRotY+')');
      });
      break;
    case LABEL_ROTATOR:
      let oriRotX = parseFloat(labelNS.curLabel.firstChild.getAttribute('width')) * labelNS.curScale * 0.5;
      let oriRotY = parseFloat(labelNS.curLabel.firstChild.getAttribute('height')) * labelNS.curScale * 0.5;
      let degree = (Math.atan2(endY - (labelNS.preY + oriRotY), endX - (labelNS.preX + oriRotX)) * 180 / Math.PI) + 90;
      degree = degree < 0 ? degree + 360 : degree;
      degree = parseInt(degree);
      labelNS.curLabel.setAttribute('transform', 'translate('+labelNS.preX+' '+labelNS.preY+') scale('+labelNS.curScale+') rotate('+degree+' '+labelNS.preRotX+' '+labelNS.preRotY+')');
      break;
  }
  updateAnchors(labelBody);
}


const createLabel = () => {
  let labelBody = labelNS.curLabel.firstChild;

  if(labelBody.getAttribute('width') < 10 && labelBody.getAttribute('height') < 10) {
    labelNS.svg.removeChild(labelNS.curLabel);
    return false;
  }

  labelNS.curLabel.dataset.id = labelNS.curId++;
  labelNS.curLabel.dataset.name = '';
  labelNS.curLabel.dataset.testid = 'testLabel';

  createInputBox(labelBody);

  return true;
}


const createInputBox = labelBody => {
  let width = parseFloat(labelBody.getAttribute('width'));

  let inputWrapper = document.createElementNS(svgNS, "foreignObject");
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
    if(e.keyCode === 13) {
      labelBody.parentNode.dataset.name = e.target.value;
      labelBody.parentNode.removeChild(inputWrapper);
      _props.updateLabels(document.querySelectorAll('.label'), updateAndGetIds());
    }
  });
  inputWrapper.appendChild(input);
  labelNS.curLabel.appendChild(inputWrapper);
}


const createAnchors = label => {
  label.classList.add('selected');

  let width = parseFloat(label.firstChild.getAttribute('width'));
  let height = parseFloat(label.firstChild.getAttribute('height'));

  let line = document.createElementNS(svgNS, "line");
  line.setAttribute('x1', width*.5);
  line.setAttribute('y1', 0);
  line.setAttribute('x2', width*.5);
  line.setAttribute('y2', -25);
  line.setAttribute('stroke', '#5c6dda');
  line.setAttribute('stroke-width', 3);
  label.appendChild(line);

  let circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute('cx', width*.5);
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
    labelNS.selectedHandler = LABEL_ROTATOR;

    labelNS.startX = e.offsetX;
    labelNS.startY = e.offsetY;

    const {x, y, deg, rotX, rotY} = parseTransform(labelNS.curLabel);
    labelNS.preX = x;
    labelNS.preY = y;
    labelNS.preDegree = deg;
    labelNS.preRotX = rotX;
    labelNS.preRotY = rotY;

    deleteAnchors(e);
  });

  label.appendChild(circle);

  const anchorPosXList = [-7, width*.5-5, width-3, width-3, width-3, width*.5-5, -7, -7];
  const anchorPosYList = [-7, -7, -7, height*.5-5, height-3, height-3, height-3, height*.5-5];

  for(let i = 0; i < 8; i++){
    let anchor = document.createElementNS(svgNS, "rect");
    anchor.setAttribute('x', anchorPosXList[i]);
    anchor.setAttribute('y', anchorPosYList[i]);
    anchor.setAttribute('cursor', CURSOR_LIST[i]);
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
      labelNS.selectedHandler = LABEL_RESIZE;
      labelNS.anchor = CURSOR_LIST[i];

      const {x, y, deg, rotX, rotY, w, h} = parseTransform(labelNS.curLabel);
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

      deleteAnchors(e);
    });

    label.appendChild(anchor);
  }

  let nameLen = 0;
  if (label.dataset.name) {
    nameLen = label.dataset.name.length;
    nameLen *= 5;
  }

  let infoBox = document.createElementNS(svgNS, "rect");
  infoBox.setAttribute('x', width+23);
  infoBox.setAttribute('y', height+5);
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

  let infoTxt = document.createElementNS(svgNS, "text");
  infoTxt.setAttribute('y', height + 5);

  let tspan0 = document.createElementNS(svgNS, "tspan");
  tspan0.setAttribute('x', width + 30);
  tspan0.setAttribute('dy', 15);
  tspan0.setAttribute('font-size', 11);
  tspan0.setAttribute('font-weight', 600);
  tspan0.setAttribute('cursor', 'default');

  let tspan1 = document.createElementNS(svgNS, "tspan");
  tspan1.setAttribute('x', width + 30);
  tspan1.setAttribute('dy', 15);
  tspan1.setAttribute('font-size', 10);
  tspan1.setAttribute('cursor', 'default');
  tspan1.setAttribute('draggable', 'false');

  let tspan2 = document.createElementNS(svgNS, "tspan");
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


const updateAnchors = labelBody => {
  const width = parseFloat(labelBody.getAttribute('width'));
  const height = parseFloat(labelBody.getAttribute('height'));

  let anchorPosXList = [-7, width*.5-5, width-3, width-3, width-3, width*.5-5, -7, -7];
  let anchorPosYList = [-7, -7, -7, height*.5-5, height-3, height-3, height-3, height*.5-5];

  let i = 0;
  while (labelBody.nextSibling) {
    labelBody = labelBody.nextSibling;

    switch (labelBody.tagName) {
      case tagNm.LINE:
        labelBody.setAttribute('x1', width*.5);
        labelBody.setAttribute('x2', width*.5);
        break;
      case tagNm.CIRCLE:
        labelBody.setAttribute('cx', width*.5);
        break;
      case tagNm.RECT:
        if (labelBody.classList.contains('infoBox')) {
          labelBody.setAttribute('x', width+23);
          labelBody.setAttribute('y', height+5);
        }
        else {
          labelBody.setAttribute('x', anchorPosXList[i]);
          labelBody.setAttribute('y', anchorPosYList[i]);
          i++;
        }
        break;
      case tagNm.TEXT:
        labelBody.setAttribute('y', height + 5);
        for (let tspan of labelBody.childNodes) {
          tspan.setAttribute('x', width + 30);
        }
        break;
      case tagNm.FOREIGNOBJECT:
        labelBody.setAttribute('x', width + 20);
        break;
    }
  }
}


const deleteAnchors = e => {
  console.log('deleteAnchors\nmode: ', labelNS.mode);

  if (e && e.ctrlKey) {
    labelNS.selectedLabel = null;
    return;
  }

  document.querySelectorAll('.selected').forEach(label => {
    if(label === labelNS.selectedLabel) {
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
    const {x, y, deg, rotX, rotY} = parseTransform(labelNS.selectedLabel);
    labelNS.selectedLabelsInfo = [{id: parseInt(labelNS.selectedLabel.dataset.id), preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY}];
  }

  labelNS.selectedLabel = null;
}


const updateAndGetIds = () => {
  let _ids = [];

  document.querySelectorAll('.selected').forEach(label => {
    _ids.push(parseInt(label.dataset.id));
  });

  return labelNS.selectedLabelsIds = _ids;
}


function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  }
}
