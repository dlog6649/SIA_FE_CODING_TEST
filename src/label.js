import { _props, _setScale } from './components/LabelBoard';
import { LABEL_SELECT_MODE, LABEL_CREATE_MODE } from './modules/annotator';

const svgNS = 'http://www.w3.org/2000/svg';

var svg;
var contextmenu;
var mode = LABEL_SELECT_MODE;
var curId = 0;
var curScale = 0.7;

var isDrawing = false;
var isDragging = false;
var isPushingSpacebar = false;
var isPushingCtrl = false;

var startX;
var startY;
var preX;
var preY;
var preDegree;
var preRotX;
var preRotY;
var preWidth;
var preHeight;
var menuX;
var menuY;

var cloneLbls = [];
var curLabel;
var selLbl;
var selLblsInfo = [];
var selLblIds = [];
var allLblsInfo = [];

//   9
// 0 1 2
// 7 8 3
// 6 5 4
const cursorList = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];
var selectedHandlerNo;


export const compareImage = _image => {
  if(!_image) {
    return true;
  }

  let image = document.querySelector('#img');

  if(!image) {
    return false;
  }
  
  let transform = image.getAttribute('transform').split(' ');
  let x = parseFloat(transform[0].substring(10));
  let y = parseFloat(transform[1].split(')')[0]);
  let s = parseFloat(transform[2].substring(6).split(')')[0]);

  if (_image.x !== x || _image.y !== y || _image.scale !== s) {
    return false;
  }
  return true;
}


export const compareLabels = _labels => {
  if (!_labels) {
    _labels = [];
  }

  let labels = document.querySelectorAll('.label');

  if (_labels.length !== labels.length) {
    return false;
  }

  for (let label of labels) {
    let _label = _labels.find(_label => _label.id === label.dataset.id);

    if(!_label) {
      return false;
    }
    
    let transform = label.getAttribute('transform').split(' ');
    let x = parseFloat(transform[0].substring(10));
    let y = parseFloat(transform[1].split(')')[0]);
    let w = parseFloat(label.firstChild.getAttribute('width'));
    let h = parseFloat(label.firstChild.getAttribute('height'));

    let _x = parseFloat(_label.coordinates[0].x);
    let _y = parseFloat(_label.coordinates[0].y);
    let _w = parseFloat((_label.coordinates[1].x - _label.coordinates[0].x).toFixed(2));
    let _h = parseFloat((_label.coordinates[3].y - _label.coordinates[0].y).toFixed(2));

    if (x !== _x || y !== _y || w !== _w || h !== _h) {
      return false;
    }
  }
  return true;
}


export const compareIds = propsIds => {
  if(selLblIds.length !== propsIds.length) {
    return false;
  }
  for(let i = 0; i < propsIds.length; i++) {
    if(!selLblIds.includes(propsIds[i])) {
      return false;
    }
  }
  return true;
}


export const getMode = () => {
  return mode;
}


export const setSelLblIds = _ids => {
  console.log('label.setIds');

  deleteAnchors();

  selLblIds = _ids;

  selLblIds.forEach(id => {
    document.querySelectorAll('.label').forEach(label => {
      if(id === label.dataset.id) {
        createAnchors(label);
      }
    });
  });
}


export const setMode = _mode => {
  mode = _mode;

  document.querySelectorAll('.label').forEach(label => {
    mode === LABEL_SELECT_MODE ? label.firstChild.setAttribute('cursor', 'move') : label.firstChild.setAttribute('cursor', 'auto');
  });
  
  selLbl = null;
  deleteAnchors();
}


export const initialize = () => {
  console.log('initializing');

  document.addEventListener('keydown', documentKeydownEvent);
  document.addEventListener('keyup', documentKeyupEvent);
  document.addEventListener('mouseup', documentMouseupEvent);
  document.addEventListener("click", hideContextmenu);
  document.addEventListener("mousewheel", hideContextmenu);
  document.addEventListener("contextmenu", hideDefaultContextmenu);
  
  svg = document.querySelector('#svg');
  svg.addEventListener('mousedown', svgMousedownEvent);
  svg.addEventListener('mousemove', throttle(svgMousemoveEvent, 25));
  svg.addEventListener('mousewheel', throttle(svgMousewheelEvent, 40));
  svg.addEventListener("contextmenu", showContextmenu);

  buildContextmenu();

  document.querySelector('.scaler-range').addEventListener('change', imgScaleSliderEvent);

  let lbls = document.querySelectorAll('.label');
  curId = !lbls.length ? 0 : parseInt(lbls[lbls.length - 1].id) + 1;
}


export const finalize = () => {
  console.log('finalizing');
  
  document.removeEventListener('keydown', documentKeydownEvent);
  document.removeEventListener('keyup', documentKeyupEvent);
  document.removeEventListener('mouseup', documentMouseupEvent);
  document.removeEventListener("click", hideContextmenu);
  document.removeEventListener("mousewheel", hideContextmenu);
  document.removeEventListener("contextmenu", hideDefaultContextmenu);
}


const hideDefaultContextmenu = e => {
  e.preventDefault();
}


const buildContextmenu = () => {
  contextmenu = document.querySelector('.label-contextmenu');
  contextmenu.addEventListener('click', e => {
    e.stopPropagation();

    let menu = e.target.tagName === 'SPAN' ? e.target.parentNode : e.target;

    switch (menu.id) {
      case 'edit':
        let child = curLabel.firstChild;
        while (child) {
          if (child.tagName === 'foreignObject') {
            contextmenu.style.display = 'none';
            return;
          }
          child = child.nextSibling;
        }

        let labelBody = curLabel.firstChild;
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
        if (curLabel.dataset.name !== '') {
          input.setAttribute('value', curLabel.dataset.name);
        }
        input.addEventListener('mousedown', e => {
          e.stopPropagation();
        });
        input.addEventListener('keydown', e => {
          if(e.keyCode === 13) {
            labelBody.parentNode.dataset.name = e.target.value;
            labelBody.parentNode.removeChild(inputWrapper);
            _props.updateLabels(document.querySelectorAll('.label'), updateAndGetIds());
          }
        });

        inputWrapper.appendChild(input);
        curLabel.appendChild(inputWrapper);
        break;
      case 'cut':
        copySelectedLabels();
        deleteSelectedLabels();
        break;
      case 'copy':
        copySelectedLabels();
        break;
      case 'paste':
        pasteCopiedLabels(true);
        break;
      case 'delete':
        deleteSelectedLabels();
        break;
    }

    contextmenu.style.display = 'none';
  });
}


const hideContextmenu = () => {
  contextmenu.style.display = 'none';
}


const showContextmenu = e => {
  e.preventDefault();

  if (mode === LABEL_CREATE_MODE) {
    return;
  }

  menuX = e.offsetX;
  menuY = e.offsetY;

  contextmenu.style.display = 'block';
  contextmenu.style.left = e.pageX + 'px';
  contextmenu.style.top = e.pageY + 'px';

  if (e.target.id === 'svg' || e.target.tagName === 'image') {
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

  if (!cloneLbls.length) {
    document.querySelector('.item.paste').classList.add('disabled');
  }
  else {
    document.querySelector('.item.paste').classList.remove('disabled');
  }
}


export const drawImage = (url, image) => {
  if(!image) {
    return;
  }
  if(document.querySelector("#img")) {
    svg.removeChild(document.querySelector("#img"));
  }

  curScale = parseFloat(image.scale);
  
  let img = document.createElementNS(svgNS, 'image');
  img.setAttribute('transform', 'translate('+image.x+' '+image.y+') scale('+curScale+')');
  img.setAttribute('href', url);
  img.setAttribute('alt', 'sampleImg');
  img.id = 'img';

  svg.appendChild(img);
}


export const drawLabels = (lbls, _selLblIds) => {
  let i = 0;
  document.querySelectorAll('.label').forEach(label => {
    console.log('delete label: ',i);
    svg.removeChild(label);
    i++;
  });

  curId = !lbls.length ? 0 : parseInt(lbls[lbls.length - 1].id) + 1;

  lbls.forEach(label => {
    let x = label.coordinates[0].x;
    let y = label.coordinates[0].y;
    let width = parseFloat((label.coordinates[1].x - label.coordinates[0].x).toFixed(2));
    let height = parseFloat((label.coordinates[3].y - label.coordinates[0].y).toFixed(2));

    let newLabel = document.createElementNS(svgNS, "g");
    newLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate(0 '+width*.5+' '+height*.5+')');
    newLabel.classList.add('label');
    newLabel.dataset.id = label.id;
    newLabel.dataset.name = label.name;

    let labelBody = document.createElementNS(svgNS, "rect");
    labelBody.setAttribute('width', width);
    labelBody.setAttribute('height', height);
    labelBody.setAttribute('fill', '#5c6dda');
    labelBody.setAttribute('fill-opacity', '0.2');
    labelBody.setAttribute('stroke', '#5c6dda');
    labelBody.setAttribute('stroke-width', 3);
    labelBody.addEventListener('mousedown', labelBodyMouseDownEvent);

    if(mode === LABEL_SELECT_MODE) {
      labelBody.setAttribute('cursor', 'move');
    }

    newLabel.appendChild(labelBody);
    svg.appendChild(newLabel);

    _selLblIds.forEach(id => {
      if(newLabel.dataset.id === id) {
        createAnchors(newLabel);
      }
    });
  });
}


const documentKeydownEvent = e => {
  console.log('keydown');

  let key = 'which' in e ? e.which : e.keyCode;

  if (key === 32) { // spacebar
    isPushingSpacebar = true;
  }
  if (key === 46 || key === 8) { // delete or backspace
    deleteSelectedLabels();
  }
  if (e.ctrlKey) {
    isPushingCtrl = true;
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

const copySelectedLabels = () => {
  cloneLbls = [];
  for(let lbl of document.querySelectorAll('.selected')) {
    cloneLbls.push(lbl.cloneNode(true));
  }
}

const pasteCopiedLabels = isClickedMenu => {
  if (!cloneLbls.length) {
    return;
  }

  let transform, standardX, standardY, movedX, movedY;

  if (isClickedMenu) {
    transform = cloneLbls[0].getAttribute('transform').split(' ');
    standardX = parseFloat(transform[0].substring(10));
    standardY = parseFloat(transform[1].split(')')[0]);
    movedX = menuX - standardX;
    movedY = menuY - standardY;
  }
  else {
    movedX = 10;
    movedY = 10;
  }

  for (let i = 0; i < cloneLbls.length; i++) {
    transform = cloneLbls[i].getAttribute('transform').split(' ');
    let x = parseFloat(transform[0].substring(10));
    let y = parseFloat(transform[1].split(')')[0]);
    let deg = parseInt(transform[3].substring(7));
    let rotX = parseFloat(transform[4]);
    let rotY = parseFloat(transform[5].split(')')[0]);

    cloneLbls[i].setAttribute('transform', 'translate('+(x+movedX)+' '+(y+movedY)+') scale('+curScale+') rotate('+deg+' '+rotX+' '+rotY+')');
    cloneLbls[i].dataset.id = curId++;
    cloneLbls[i].firstChild.addEventListener('mousedown', labelBodyMouseDownEvent);

    svg.appendChild(cloneLbls[i]);

    cloneLbls[i] = cloneLbls[i].cloneNode(true);
  }
  _props.createLabels(cloneLbls);
}


const documentKeyupEvent = e => {
  let key = 'which' in e ? e.which : e.keyCode;

  if(key === 32) {
    isPushingSpacebar = false;
  }
  if(key === 17) {
    isPushingCtrl = false;
  }
}


const deleteSelectedLabels = () => {
  let selLbls = document.querySelectorAll('.selected');
  
  if(!selLbls.length) {
    return;
  }
  
  let deletedIds = [];

  for(let lbl of selLbls) {
    deletedIds.push(lbl.dataset.id);
    svg.removeChild(lbl);
  }

  _props.deleteLabels(deletedIds);
}


function imgScaleSliderEvent() {
  let val = parseFloat(this.value);
  
  if(curScale === val) {
    return;
  }
  
  let preScale = curScale;
  curScale = val;

  let img = document.querySelector('#img');
  let transform = img.getAttribute('transform').split(' ');
  let imgX = parseFloat(transform[0].substring(10));
  let imgY = parseFloat(transform[1].split(')')[0]);
  img.setAttribute('transform', 'translate('+imgX+' '+imgY+') scale('+curScale+')');

  let labels = document.querySelectorAll('.label');

  labels.forEach(label => {
    transform = label.getAttribute('transform').split(' ');
    let labelX = parseFloat(transform[0].substring(10));
    let labelY = parseFloat(transform[1].split(')')[0]);
    let newX = parseFloat(((((labelX - imgX) / preScale) * curScale) + imgX).toFixed(2));
    let newY = parseFloat(((((labelY - imgY) / preScale) * curScale) + imgY).toFixed(2));

    let degree = parseInt(transform[3].substring(7));
    let rotX = parseFloat(transform[4]);
    let rotY = parseFloat(transform[5].split(')')[0]);
    
    label.setAttribute('transform', 'translate('+newX+' '+newY+') scale('+curScale+') rotate('+degree+' '+rotX+' '+rotY+')');
  });

  _props.updateImgLabels(img, labels);
}


const svgMousewheelEvent = e => {
  console.log('svgMousewheelEvent');
  e.preventDefault();

  if((curScale <= 0.1 && e.deltaY > 0) || (curScale >= 2 && e.deltaY < 0)) {
    return;
  }

  let preScale = curScale;
  e.deltaY > 0 ? curScale = parseFloat((curScale - 0.1).toFixed(1)) : curScale = parseFloat((curScale + 0.1).toFixed(1));

  let scaler = document.querySelector('.scaler-range');
  scaler.style.background = 'linear-gradient(to right, #333333 0%, #333333 ' + curScale*50 + '%, #dedede ' + curScale*50 + '%, #dedede 100%)';
  _setScale(curScale);
  
  let img = document.querySelector('#img');
  let transform = img.getAttribute('transform').split(' ');
  let imgX = parseFloat(transform[0].substring(10));
  let imgY = parseFloat(transform[1].split(')')[0]);
  img.setAttribute('transform', 'translate('+imgX+' '+imgY+') scale('+curScale+')');

  let labels = document.querySelectorAll('.label');

  labels.forEach(label => {
    transform = label.getAttribute('transform').split(' ');
    let labelX = parseFloat(transform[0].substring(10));
    let labelY = parseFloat(transform[1].split(')')[0]);
    let newX = parseFloat(((((labelX - imgX) / preScale) * curScale) + imgX).toFixed(2));
    let newY = parseFloat(((((labelY - imgY) / preScale) * curScale) + imgY).toFixed(2));

    let degree = parseInt(transform[3].substring(7));
    let rotX = parseFloat(transform[4]);
    let rotY = parseFloat(transform[5].split(')')[0]);
    
    label.setAttribute('transform', 'translate('+newX+' '+newY+') scale('+curScale+') rotate('+degree+' '+rotX+' '+rotY+')');
  });

  _props.updateImgLabels(img, labels);
}


const svgMousedownEvent = e => {
  console.log('svg mousedown');

  if(isPushingSpacebar) {
    isDragging = true;
    dragImg(e);
  }
  else if(mode === LABEL_CREATE_MODE) {
    // 마우스 왼쪽 클릭이 아니면
    if (e.button !== 0) {
      return;
    }
    isDrawing = true;
    initializeLabel(e);
  }
  else if(mode === LABEL_SELECT_MODE) {
    if (document.querySelectorAll('.selected').length === 0) {
      return;
    }
    deleteAnchors();
    _props.selectLabels(updateAndGetIds());
  }
}


const dragImg = e => {
  startX = e.offsetX;
  startY = e.offsetY;

  let transform = document.querySelector('#img').getAttribute('transform').split(' ');
  preX = parseFloat(transform[0].substring(10));
  preY = parseFloat(transform[1].split(')')[0]);

  let _allLblsInfo = [];
  document.querySelectorAll('.label').forEach(label => {
    let transform = label.getAttribute('transform').split(' ');
    let x = parseFloat(transform[0].substring(10));
    let y = parseFloat(transform[1].split(')')[0]);
    let deg = parseInt(transform[3].substring(7));
    let rotX = parseFloat(transform[4]);
    let rotY = parseFloat(transform[5].split(')')[0]);
    _allLblsInfo.push({id: label.dataset.id, preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY});
  })
  allLblsInfo = _allLblsInfo;
}


const initializeLabel = e => {
  startX = e.offsetX;
  startY = e.offsetY;

  curLabel = document.createElementNS(svgNS, "g");
  curLabel.setAttribute('transform', 'translate('+startX+' '+startY+') scale('+curScale+') rotate(0 0 0)');
  curLabel.classList.add('label');

  let labelBody = document.createElementNS(svgNS, "rect");
  labelBody.setAttribute('width', 0);
  labelBody.setAttribute('height', 0);
  labelBody.setAttribute('fill', '#5c6dda');
  labelBody.setAttribute('fill-opacity', '0.2');
  labelBody.setAttribute('stroke', '#5c6dda');
  labelBody.setAttribute('stroke-width', 3);
  labelBody.addEventListener('mousedown', labelBodyMouseDownEvent);

  curLabel.appendChild(labelBody);
  svg.appendChild(curLabel);
}


const labelBodyMouseDownEvent = e => {
  if (e.button !== 0 && e.button !== 2) {
    return;
  }

  curLabel = e.target.parentNode;

  if (mode === LABEL_CREATE_MODE || isPushingSpacebar) {
    return;
  }

  console.log('labelBodyMouseDownEvent');
  e.stopPropagation();

  isDragging = true;
  selectedHandlerNo = 8;
  curLabel = selLbl = e.target.parentNode;
  startX = e.offsetX;
  startY = e.offsetY;

  if(curLabel.childNodes.length < 3){
    createAnchors(curLabel);
  }
  deleteAnchors();

  // 선택된 레이블들의 이전 정보 세팅
  let _selLblsInfo = [];
  document.querySelectorAll('.selected').forEach(label => {
    let transform = label.getAttribute('transform').split(' ');
    let x = parseFloat(transform[0].substring(10));
    let y = parseFloat(transform[1].split(')')[0]);
    let deg = parseInt(transform[3].substring(7));
    let rotX = parseFloat(transform[4]);
    let rotY = parseFloat(transform[5].split(')')[0]);
    _selLblsInfo.push({id: label.dataset.id, preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY});
  });
  selLblsInfo = _selLblsInfo;
}

const svgMousemoveEvent = e => {
  if (isDragging && isPushingSpacebar) {
    let endX = e.offsetX;
    let endY = e.offsetY;
    let imgX = preX + endX - startX;
    let imgY = preY + endY - startY;
    document.querySelector('#img').setAttribute('transform', 'translate('+imgX+' '+imgY+') scale('+curScale+')');

    document.querySelectorAll('.label').forEach(label => {
      let info = allLblsInfo.find(_label => _label.id === label.dataset.id);
      let labelX = (info.preX + endX - startX).toFixed(2);
      let labelY = (info.preY + endY - startY).toFixed(2);
      label.setAttribute('transform', 'translate('+labelX+' '+labelY+') scale('+curScale+') rotate('+info.preDegree+' '+info.preRotX+' '+info.preRotY+')');
    });
  }
  else if (isDrawing && mode === LABEL_CREATE_MODE) {
    console.log('LABEL_CREATE_MODE mousemove');

    let endX = e.offsetX;
    let endY = e.offsetY;
    let x = startX < endX ? startX : endX;
    let y = startY < endY ? startY : endY;
    let width = startX > endX ? startX - endX : endX - startX;
    let height = startY > endY ? startY - endY : endY - startY;
    
    curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate(0 '+width*.5+' '+height*.5+')');
    curLabel.firstChild.setAttribute('width', parseFloat((width/curScale).toFixed(2)));
    curLabel.firstChild.setAttribute('height', parseFloat((height/curScale).toFixed(2)));
  }
  else if (isDragging && mode === LABEL_SELECT_MODE) {
    console.log('LABEL_SELECT_MODE mousemove');
    
    let endX = e.offsetX;
    let endY = e.offsetY;
    let x, y, width, height;
    let labelBody = curLabel.firstChild;

    switch (selectedHandlerNo) {
      case 0:
        x = preX + preWidth > endX ? endX : preX + preWidth;
        y = preY + preHeight > endY ? endY : preY + preHeight;
        width = preX + preWidth > endX ? preX + preWidth - endX : endX - (preX + preWidth);
        height = preY + preHeight > endY ? preY + preHeight - endY : endY - (preY + preHeight);
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseFloat((width/curScale).toFixed(2)));
        labelBody.setAttribute('height', parseFloat((height/curScale).toFixed(2)));
        break;
      case 1:
        x = preX;
        y = preY + preHeight > endY ? endY : preY + preHeight;
        width = preWidth;
        height = preY + preHeight > endY ? preY + preHeight - endY : endY - (preY + preHeight);
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('height', parseFloat((height/curScale).toFixed(2)));
        break;
      case 2:
        x = preX < endX ? preX : endX;
        y = preY + preHeight > endY ? endY : preY + preHeight;
        width = preX > endX ? preX - endX : endX - preX;
        height = preY + preHeight > endY ? preY + preHeight - endY : endY - (preY + preHeight);
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseFloat((width/curScale).toFixed(2)));
        labelBody.setAttribute('height', parseFloat((height/curScale).toFixed(2)));
        break;
      case 3:
        x = preX < endX ? preX : endX;
        y = preY;
        width = preX > endX ? preX - endX : endX - preX;
        height = preHeight;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseFloat((width/curScale).toFixed(2)));
        break;
      case 4:
        x = preX < endX ? preX : endX;
        y = preY < endY ? preY : endY;
        width = preX > endX ? preX - endX : endX - preX;
        height = preY > endY ? preY - endY : endY - preY;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseFloat((width/curScale).toFixed(2)));
        labelBody.setAttribute('height', parseFloat((height/curScale).toFixed(2)));
        break;
      case 5:
        x = preX;
        y = preY < endY ? preY : endY;
        width = preWidth;
        height = preY > endY ? preY - endY : endY - preY;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('height', parseFloat((height/curScale).toFixed(2)));
        break;
      case 6:
        x = preX + preWidth > endX ? endX : preX + preWidth;
        y = preY < endY ? preY : endY;
        width = preX + preWidth > endX ? preX + preWidth - endX : endX - (preX + preWidth);
        height = preY > endY ? preY - endY : endY - preY;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseFloat((width/curScale).toFixed(2)));
        labelBody.setAttribute('height', parseFloat((height/curScale).toFixed(2)));
        break;
      case 7:
        x = preX + preWidth > endX ? endX : preX + preWidth;
        y = preY;
        width = preX + preWidth > endX ? preX + preWidth - endX : endX - (preX + preWidth);
        height = preHeight;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseFloat((width/curScale).toFixed(2)));
        break;
      case 8:
        document.querySelectorAll('.selected').forEach(label => {
          let info = selLblsInfo.find(selLabel => selLabel.id === label.dataset.id);
          x = (info.preX + endX - startX).toFixed(2);
          y = (info.preY + endY - startY).toFixed(2);
          label.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+info.preDegree+' '+info.preRotX+' '+info.preRotY+')');
        });
        break;
      case 9:
        x = preX;
        y = preY;
        var degree = (Math.atan2(parseFloat(endY) - parseFloat((preY + preRotY)), parseFloat(endX) - parseFloat((preX + preRotX))) * 180 / 3.1415) + 90;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+degree+' '+preRotX+' '+preRotY+')');
        break;
    }
    updateAnchors(labelBody);
  }
}


const documentMouseupEvent = e => {
  console.log('document mouseup');

  if (isDragging && isPushingSpacebar) {
    _props.updateImgLabels(document.querySelector('#img'), document.querySelectorAll('.label'));
  }
  else if (isDrawing && mode === LABEL_CREATE_MODE) {
    if(createLabel()) {
      _props.createLabels([curLabel]);
    }
  }
  else if (isDragging && mode === LABEL_SELECT_MODE) {
    _props.updateLabels(document.querySelectorAll('.label'), updateAndGetIds());
  }
  
  isDrawing = false;
  isDragging = false;
}


const createLabel = () => {
  let labelBody = curLabel.firstChild;

  if(labelBody.getAttribute('width') < 10 && labelBody.getAttribute('height') < 10) {
    svg.removeChild(curLabel);
    return false;
  }

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
  input.addEventListener('mousedown', e => {
    e.stopPropagation();
  });
  input.addEventListener('keydown', e => {
    if(e.keyCode === 13) {
      labelBody.parentNode.dataset.name = e.target.value;
      labelBody.parentNode.removeChild(inputWrapper);

      _props.updateLabels(document.querySelectorAll('.label'), updateAndGetIds());
    }
  });
  
  curLabel.dataset.id = curId++;

  inputWrapper.appendChild(input);
  curLabel.appendChild(inputWrapper);

  curLabel.dataset.name = '';

  return true;
}


const createAnchors = label => {
  console.log('createAnchors');

  label.classList.add('selected');

  let width = label.firstChild.getAttribute('width');
  let height = label.firstChild.getAttribute('height');

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
  
    curLabel = e.target.parentNode;
  
    if (mode === LABEL_CREATE_MODE || isPushingSpacebar) {
      return;
    }
    
    console.log('anchor mousedown');
    e.stopPropagation();

    isDragging = true;
    curLabel = selLbl = e.target.parentNode;
    selectedHandlerNo = 9;

    startX = e.offsetX;
    startY = e.offsetY;

    let transform = curLabel.getAttribute('transform').split(' ');
    preX = parseFloat(transform[0].substring(10));
    preY = parseFloat(transform[1].split(')')[0]);
    preRotX = parseFloat(transform[4]);
    preRotY = parseFloat(transform[5].split(')')[0]);
    
    deleteAnchors();
  });

  label.appendChild(circle);

  const anchorPosXList = [-7, width*.5-5, width-3, width-3, width-3, width*.5-5, -7, -7];
  const anchorPosYList = [-7, -7, -7, height*.5-5, height-3, height-3, height-3, height*.5-5];

  for(let i = 0; i < 8; i++){
    let anchor = document.createElementNS(svgNS, "rect");
    anchor.setAttribute('x', anchorPosXList[i]);
    anchor.setAttribute('y', anchorPosYList[i]);
    anchor.setAttribute('cursor', cursorList[i]);
    anchor.setAttribute('width', 10);
    anchor.setAttribute('height', 10);
    anchor.setAttribute('fill', 'white');
    anchor.setAttribute('stroke', '#5c6dda');
    anchor.setAttribute('stroke-width', 3);
    anchor.addEventListener('mousedown', e => {
      if (e.button !== 0 && e.button !== 2) {
        return;
      }
    
      curLabel = e.target.parentNode;
    
      if (mode === LABEL_CREATE_MODE || isPushingSpacebar) {
        return;
      }

      console.log('anchor mousedown');
      e.stopPropagation();

      isDragging = true;
      curLabel = selLbl = e.target.parentNode;
      selectedHandlerNo = i;
      
      let transform = curLabel.getAttribute('transform').split(' ');
      preX = parseFloat(transform[0].substring(10));
      preY = parseFloat(transform[1].split(')')[0]);
      preDegree = parseFloat(transform[3].substring(7));
      preWidth = parseFloat((curLabel.firstChild.getAttribute('width') * curScale).toFixed(2));
      preHeight = parseFloat((curLabel.firstChild.getAttribute('height') * curScale).toFixed(2));

      deleteAnchors();
    });

    label.appendChild(anchor);
  }
}


const updateAnchors = labelBody => {
  const width = parseFloat(labelBody.getAttribute('width'));
  const height = parseFloat(labelBody.getAttribute('height'));

  let anchorPosXList = [-7, width*.5-5, width-3, width-3, width-3, width*.5-5, -7, -7];
  let anchorPosYList = [-7, -7, -7, height*.5-5, height-3, height-3, height-3, height*.5-5];

  let i = 0;
  while(labelBody.nextSibling){
    labelBody = labelBody.nextSibling;
    if(labelBody.tagName === 'line') {
      labelBody.setAttribute('x1', width*.5);
      labelBody.setAttribute('x2', width*.5);
    }
    else if(labelBody.tagName === 'circle') {
      labelBody.setAttribute('cx', width*.5);
    }
    else if(labelBody.tagName === 'rect') {
      labelBody.setAttribute('x', anchorPosXList[i]);
      labelBody.setAttribute('y', anchorPosYList[i]);
      i++;
    }
    else if(labelBody.tagName === 'foreignObject') {
      labelBody.setAttribute('x', width + 20);
    }
  }
}


const deleteAnchors = () => {
  console.log('deleteAnchors\nmode: ', mode, '\nisPushingCtrl: ', isPushingCtrl);

  if(isPushingCtrl) {
    selLbl = null;
    return;
  }

  document.querySelectorAll('.selected').forEach(label => {
    if(label === selLbl) {
      return true;
    }

    label.classList.remove('selected');

    let j = 0;
    // if([...label.childNodes].find(node => node.tagName === 'foreignObject')) {
    //   j = 1;
    // }

    for (let i = label.childNodes.length - 1; i > j; i--) {
      label.removeChild(label.childNodes[i]);
    }
  });

  // 하나도 선택된게 없는 상태
  if (!selLbl) {
    selLblsInfo = [];
  }// 한개만 선택된 상태
  else {
    let transform = selLbl.getAttribute('transform').split(' ');
    let x = parseFloat(transform[0].substring(10));
    let y = parseFloat(transform[1].split(')')[0]);
    let deg = parseInt(transform[3].substring(7));
    let rotX = parseFloat(transform[4]);
    let rotY = parseFloat(transform[5].split(')')[0]);
    selLblsInfo = [{id: selLbl.dataset.id, preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY}];
  }

  selLbl = null;
}


const updateAndGetIds = () => {
  let _ids = [];

  document.querySelectorAll('.selected').forEach(label => {
    _ids.push(label.dataset.id);
  });

  return selLblIds = _ids;
}


function throttle (func, wait, options) {
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
  };
};