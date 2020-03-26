import { _props } from './components/LabelBoard';
import { LABEL_SELECT_MODE, LABEL_CREATE_MODE } from './modules/annotator';

const svgNS = 'http://www.w3.org/2000/svg';

var svg;
var mode = LABEL_SELECT_MODE;
var curId;
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

var curLabel;
var labels = [];
var selectedLabel;
var selectedLabelsInfo = [];
var selectedLabelIds = [];
var allLabelsInfo = [];

//   9
// 0 1 2
// 7 8 3
// 6 5 4
const cursorList = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];
var selectedHandlerNo;


export const compareIds = propsIds => {
  if(selectedLabelIds.length !== propsIds.length) {
    return false;
  }
  for(let i = 0; i < propsIds.length; i++) {
    if(!selectedLabelIds.includes(propsIds[i])) {
      return false;
    }
  }
  return true;
}

export const getMode = () => {
  return mode;
}

export const getLabels = () => {
  return labels;
}

export const getSelectedLabelIds = () => {
  return selectedLabelIds;
}

export const setSelectedLabelIds = _ids => {
  console.log('label.setIds');

  deleteAnchors();

  selectedLabelIds = _ids;

  selectedLabelIds.forEach(id => {
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
  
  selectedLabel = null;
  deleteAnchors();
}

export const initialize = () => {
  console.log('initializing');

  document.addEventListener('keydown', documentKeydownEvent);
  document.addEventListener('keyup', documentKeyupEvent);
  document.addEventListener('mouseup', documentMouseupEvent);

  svg = document.querySelector('#svg');
  svg.addEventListener('mousedown', svgMousedownEvent);
  svg.addEventListener('mousemove', throttle(svgMousemoveEvent, 25));
  svg.addEventListener('mousewheel', throttle(svgMousewheelEvent, 40))
}

export const finalize = () => {
  console.log('finalizing');
  
  document.removeEventListener('keydown', documentKeydownEvent);
  document.removeEventListener('keyup', documentKeyupEvent);
  document.removeEventListener('mouseup', documentMouseupEvent);
}

export const drawImage = image => {
  if(image === undefined) {
    return;
  }
  if(document.querySelector("#img")) {
    svg.removeChild(document.querySelector("#img"));
  }

  curScale = parseFloat(image.scale);
  
  let img = document.createElementNS(svgNS, 'image');
  img.setAttribute('transform', 'translate('+image.x+' '+image.y+') scale('+curScale+')');
  img.setAttribute('href', image.url);
  img.setAttribute('alt', 'sampleImg');
  img.id = 'img';

  svg.appendChild(img);
}

export const drawLabels = (labels, _selectedLabelIds) => {
  let i = 0;
  document.querySelectorAll('.label').forEach(label => {
    console.log('delete label: ',i);
    svg.removeChild(label);
    i++;
  });

  labels.length === 0 ? curId = 0 : curId = parseInt(labels[labels.length - 1].id) + 1;

  labels.forEach(label => {
    let x = parseFloat(label.coordinates[0].x);
    let y = parseFloat(label.coordinates[0].y);

    let width = parseInt(parseFloat(label.coordinates[1].x) - parseFloat(label.coordinates[0].x));
    let height = parseInt(parseFloat(label.coordinates[3].y) - parseFloat(label.coordinates[0].y));

    let newLabel = document.createElementNS(svgNS, "g");
    newLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate(0 '+width*.5+' '+height*.5+')');
    newLabel.classList.add('label');
    newLabel.dataset.id = label.id;
    newLabel.dataset.name = label.name;

    // coordinates
    // 0 1
    // 3 2
    newLabel.dataset.xCoordinate0 = x;
    newLabel.dataset.yCoordinate0 = y;
    newLabel.dataset.xCoordinate1 = (x + width).toFixed(1);
    newLabel.dataset.yCoordinate1 = y;
    newLabel.dataset.xCoordinate2 = (x + width).toFixed(1);
    newLabel.dataset.yCoordinate2 = (y + height).toFixed(1);
    newLabel.dataset.xCoordinate3 = x;
    newLabel.dataset.yCoordinate3 = (y + height).toFixed(1);

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

    if(newLabel.dataset.name === '') {
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
  
          updateIds();
          _props.updateLabels(document.querySelectorAll('.label'), selectedLabelIds);
        }
      });
      inputWrapper.appendChild(input);
      newLabel.appendChild(inputWrapper);
    }

    _selectedLabelIds.forEach(id => {
      if(newLabel.dataset.id === id) {
        createAnchors(newLabel);
      }
    });
  });
}

const documentKeydownEvent = e => {
  console.log('keydown');

  if(e.keyCode === 32) {
    isPushingSpacebar = true;
  }
  
  if(e.keyCode === 46 || e.keyCode === 8) {
    let deletedIds = [];
    document.querySelectorAll('.selected').forEach(label => {
      deletedIds.push(label.dataset.id);
      svg.removeChild(label);
    });
    _props.deleteLabels(deletedIds);
  }
  
  if(e.keyCode === 17) {
    isPushingCtrl = true;
  }
}

const documentKeyupEvent = e => {
  if(e.keyCode === 32) {
    isPushingSpacebar = false;
  }
  if(e.keyCode === 17) {
    isPushingCtrl = false;
  }
}

const svgMousewheelEvent = e => {
  console.log('svgMousewheelEvent');
  e.preventDefault();

  let preScale;

  if(e.deltaY > 0) {
    curScale -= 0.1;
    curScale = parseFloat(curScale.toFixed(1));
    preScale = curScale + 0.1;
  }
  else {
    curScale += 0.1;
    curScale = parseFloat(curScale.toFixed(1));
    preScale = curScale - 0.1;
  }
  
  if(curScale < 0.1) {
    curScale = 0.1;
    return;
  }
  else if(curScale > 2) {
    curScale = 2;
    return;
  }
  
  let img = document.querySelector('#img');
  let transForm = img.getAttribute('transform').split(' ');
  let imgX = parseFloat(transForm[0].substring(10));
  let imgY = parseFloat(transForm[1].split(')')[0]);

  img.setAttribute('transform', 'translate('+imgX+' '+imgY+') scale('+curScale+')');

  let labels = document.querySelectorAll('.label');

  labels.forEach(label => {
    transForm = label.getAttribute('transform').split(' ');
    let labelX = parseFloat(transForm[0].substring(10));
    let labelY = parseFloat(transForm[1].split(')')[0]);

    // let newX = parseFloat((labelX / preScale * curScale).toFixed(1));
    // let newY = parseFloat((labelY / preScale * curScale).toFixed(1));
    // let newX = parseFloat((((labelX / preScale) - imgX) * curScale).toFixed(1));
    // let newY = parseFloat((((labelY / preScale) - imgY) * curScale).toFixed(1));
    let newX = parseFloat((((labelX - imgX) / preScale) * curScale).toFixed(1));
    let newY = parseFloat((((labelY - imgY) / preScale) * curScale).toFixed(1));

    let degree = parseInt(transForm[3].substring(7));
    let rotX = parseFloat(transForm[4]);
    let rotY = parseFloat(transForm[5].split(')')[0]);

    let width = parseFloat(label.firstChild.getAttribute('width'));
    let height = parseFloat(label.firstChild.getAttribute('height'));
    
    label.setAttribute('transform', 'translate('+newX+' '+newY+') scale('+curScale+') rotate('+degree+' '+rotX+' '+rotY+')');
    label.dataset.xCoordinate0 = newX;
    label.dataset.yCoordinate0 = newY;
    label.dataset.xCoordinate1 = (newX + width).toFixed(1);
    label.dataset.yCoordinate1 = newY;
    label.dataset.xCoordinate2 = (newX + width).toFixed(1);
    label.dataset.yCoordinate2 = (newY + height).toFixed(1);
    label.dataset.xCoordinate3 = newX;
    label.dataset.yCoordinate3 = (newY + height).toFixed(1);
  });

  updateIds();
  _props.updateAll(img, labels, selectedLabelIds);
}

const svgMousedownEvent = e => {
  console.log('svg mousedown');

  if(isPushingSpacebar) {
    isDragging = true;
    dragImg(e);
  }
  else if(mode === LABEL_CREATE_MODE) {
    isDrawing = true;
    initializeLabel(e);
  }
  else if(mode === LABEL_SELECT_MODE) {
    deleteAnchors();
    updateIds();
    _props.selectLabels(selectedLabelIds);
    
  }
}

const dragImg = e => {
  startX = e.offsetX;
  startY = e.offsetY;

  let transForm = document.querySelector('#img').getAttribute('transform').split(' ');
  preX = parseFloat(transForm[0].substring(10));
  preY = parseFloat(transForm[1].split(')')[0]);

  let _allLabelsInfo = [];
  document.querySelectorAll('.label').forEach(label => {
    let transform = label.getAttribute('transform').split(' ');
    let x = parseFloat(transform[0].substring(10));
    let y = parseFloat(transform[1].split(')')[0]);
    let deg = parseInt(transform[3].substring(7));
    let rotX = parseFloat(transform[4]);
    let rotY = parseFloat(transform[5].split(')')[0]);
    _allLabelsInfo.push({id: label.dataset.id, preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY});
  })
  allLabelsInfo = _allLabelsInfo;
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
  if(mode === LABEL_CREATE_MODE || isPushingSpacebar) {
    return;
  }
  console.log('labelBodyMouseDownEvent');
  e.stopPropagation();

  isDragging = true;
  selectedHandlerNo = 8;
  curLabel = selectedLabel = e.target.parentNode;
  startX = e.offsetX;
  startY = e.offsetY;

  if(curLabel.childNodes.length < 3){
    createAnchors(curLabel);
  }
  deleteAnchors();

  // 선택된 레이블들의 이전 정보 세팅
  let _selectedLabelsInfo = [];
  document.querySelectorAll('.selected').forEach(label => {
    let transform = label.getAttribute('transform').split(' ');
    let x = parseFloat(transform[0].substring(10));
    let y = parseFloat(transform[1].split(')')[0]);
    let deg = parseInt(transform[3].substring(7));
    let rotX = parseFloat(transform[4]);
    let rotY = parseFloat(transform[5].split(')')[0]);
    _selectedLabelsInfo.push({id: label.dataset.id, preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY});
  });
  selectedLabelsInfo = _selectedLabelsInfo;
}

const svgMousemoveEvent = e => {

  if (isDragging && isPushingSpacebar) {
    let endX = e.offsetX;
    let endY = e.offsetY;
    let imgX = preX + endX - startX;
    let imgY = preY + endY - startY;
    document.querySelector('#img').setAttribute('transform', 'translate('+imgX+' '+imgY+') scale('+curScale+')');

    document.querySelectorAll('.label').forEach(label => {
      let info = allLabelsInfo.find(_label => _label.id === label.dataset.id);
      let labelX = (info.preX + endX - startX).toFixed(1);
      let labelY = (info.preY + endY - startY).toFixed(1);
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
    curLabel.firstChild.setAttribute('width', parseInt(width/curScale));
    curLabel.firstChild.setAttribute('height', parseInt(height/curScale));
  }
  else if (isDragging && mode === LABEL_SELECT_MODE) {
    console.log('LABEL_SELECT_MODE mousemove');
    
    let endX = e.offsetX;
    let endY = e.offsetY;
    let x, y, width, height;
    let labelBody = curLabel.firstChild;

    switch(selectedHandlerNo) {
      case 0:
        x = preX + preWidth > endX ? endX : preX + preWidth;
        y = preY + preHeight > endY ? endY : preY + preHeight;
        width = preX + preWidth > endX ? preX + preWidth - endX : endX - (preX + preWidth);
        height = preY + preHeight > endY ? preY + preHeight - endY : endY - (preY + preHeight);
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseInt(width/curScale));
        labelBody.setAttribute('height', parseInt(height/curScale));
        break;
      case 1:
        x = preX;
        y = preY + preHeight > endY ? endY : preY + preHeight;
        width = preWidth;
        height = preY + preHeight > endY ? preY + preHeight - endY : endY - (preY + preHeight);
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('height', parseInt(height/curScale));
        break;
      case 2:
        x = preX < endX ? preX : endX;
        y = preY + preHeight > endY ? endY : preY + preHeight;
        width = preX > endX ? preX - endX : endX - preX;
        height = preY + preHeight > endY ? preY + preHeight - endY : endY - (preY + preHeight);
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseInt(width/curScale));
        labelBody.setAttribute('height', parseInt(height/curScale));
        break;
      case 3:
        x = preX < endX ? preX : endX;
        y = preY;
        width = preX > endX ? preX - endX : endX - preX;
        height = preHeight;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseInt(width/curScale));
        break;
      case 4:
        x = preX < endX ? preX : endX;
        y = preY < endY ? preY : endY;
        width = preX > endX ? preX - endX : endX - preX;
        height = preY > endY ? preY - endY : endY - preY;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseInt(width/curScale));
        labelBody.setAttribute('height', parseInt(height/curScale));
        break;
      case 5:
        x = preX;
        y = preY < endY ? preY : endY;
        width = preWidth;
        height = preY > endY ? preY - endY : endY - preY;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('height', parseInt(height/curScale));
        break;
      case 6:
        x = preX + preWidth > endX ? endX : preX + preWidth;
        y = preY < endY ? preY : endY;
        width = preX + preWidth > endX ? preX + preWidth - endX : endX - (preX + preWidth);
        height = preY > endY ? preY - endY : endY - preY;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseInt(width/curScale));
        labelBody.setAttribute('height', parseInt(height/curScale));
        break;
      case 7:
        x = preX + preWidth > endX ? endX : preX + preWidth;
        y = preY;
        width = preX + preWidth > endX ? preX + preWidth - endX : endX - (preX + preWidth);
        height = preHeight;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') scale('+curScale+') rotate('+preDegree+' '+width*.5+' '+height*.5+')');
        labelBody.setAttribute('width', parseInt(width/curScale));
        break;
      case 8:
        document.querySelectorAll('.selected').forEach(label => {
          let info = selectedLabelsInfo.find(selLabel => selLabel.id === label.dataset.id);
          x = (info.preX + endX - startX).toFixed(1);
          y = (info.preY + endY - startY).toFixed(1);
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
    updateIds();
    updateLabel('.label');
    _props.updateAll(document.querySelector('#img'), document.querySelectorAll('.label'), selectedLabelIds);
  }
  else if (isDrawing && mode === LABEL_CREATE_MODE) {
    createLabel();
  }
  else if (isDragging && mode === LABEL_SELECT_MODE) {
    updateIds();
    updateLabel('.selected');
    _props.updateLabels(document.querySelectorAll('.label'), selectedLabelIds);
  }
  
  isDrawing = false;
  isDragging = false;
}

const createLabel = () => {
  let labelBody = curLabel.firstChild;

  if(labelBody.getAttribute('width') < 10 || labelBody.getAttribute('height') < 10) {
    svg.removeChild(curLabel);
    return;
  }

  let transform = curLabel.getAttribute('transform').split(' ');
  let _x = parseFloat(transform[0].substring(10));
  let _y = parseFloat(transform[1].split(')')[0]);
  let width = parseInt(labelBody.getAttribute('width'));
  let height = parseInt(labelBody.getAttribute('height'));

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

      updateIds();
      _props.updateLabels(document.querySelectorAll('.label'), selectedLabelIds);
    }
  });
  
  curLabel.dataset.id = curId++;

  // coordinates
  // 0 1
  // 3 2
  curLabel.dataset.xCoordinate0 = _x;
  curLabel.dataset.yCoordinate0 = _y;
  curLabel.dataset.xCoordinate1 = (_x + width).toFixed(1);
  curLabel.dataset.yCoordinate1 = _y;
  curLabel.dataset.xCoordinate2 = (_x + width).toFixed(1);
  curLabel.dataset.yCoordinate2 = (_y + height).toFixed(1);
  curLabel.dataset.xCoordinate3 = _x;
  curLabel.dataset.yCoordinate3 = (_y + height).toFixed(1);

  inputWrapper.appendChild(input);
  curLabel.appendChild(inputWrapper);

  labelBody.parentNode.dataset.name = '';
  _props.createLabel(labelBody.parentNode);
}

const updateLabel = target => {
  document.querySelectorAll(target).forEach(label => {
    let transform = label.getAttribute('transform').split(' ');
    let x = parseFloat(transform[0].substring(10));
    let y = parseFloat(transform[1].split(')')[0]);
    let width = parseInt(label.firstChild.getAttribute('width'));
    let height = parseInt(label.firstChild.getAttribute('height'));

    label.dataset.xCoordinate0 = x;
    label.dataset.yCoordinate0 = y;
    label.dataset.xCoordinate1 = (x + width).toFixed(1);
    label.dataset.yCoordinate1 = y;
    label.dataset.xCoordinate2 = (x + width).toFixed(1);
    label.dataset.yCoordinate2 = (y + height).toFixed(1);
    label.dataset.xCoordinate3 = x;
    label.dataset.yCoordinate3 = (y + height).toFixed(1);
  });
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
    if(mode === LABEL_CREATE_MODE || isPushingSpacebar) {
      return;
    }
    console.log('anchor mousedown');
    e.stopPropagation();

    isDragging = true;
    curLabel = selectedLabel = e.target.parentNode;
    selectedHandlerNo = 9;

    startX = e.offsetX;
    startY = e.offsetY;

    let transForm = curLabel.getAttribute('transform').split(' ');
    preX = parseFloat(transForm[0].substring(10));
    preY = parseFloat(transForm[1].split(')')[0]);
    preRotX = parseFloat(transForm[4]);
    preRotY = parseFloat(transForm[5].split(')')[0]);
    
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
      if(mode === LABEL_CREATE_MODE || isPushingSpacebar) {
        return;
      }
      console.log('anchor mousedown');
      e.stopPropagation();

      isDragging = true;
      curLabel = selectedLabel = e.target.parentNode;
      selectedHandlerNo = i;
      
      let transForm = curLabel.getAttribute('transform').split(' ');
      preX = parseFloat(transForm[0].substring(10));
      preY = parseFloat(transForm[1].split(')')[0]);
      preDegree = parseFloat(transForm[3].substring(7));
      preWidth = parseInt(curLabel.firstChild.getAttribute('width') * curScale);
      preHeight = parseInt(curLabel.firstChild.getAttribute('height') * curScale);

      deleteAnchors();
    });

    label.appendChild(anchor);
  }
}

const updateAnchors = labelBody => {

  const width = labelBody.getAttribute('width');
  const height = labelBody.getAttribute('height');

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
  }
}



const deleteAnchors = () => {
  console.log('deleteAnchors\nmode: ', mode, '\nisPushingCtrl: ', isPushingCtrl);

  if(isPushingCtrl) {
    selectedLabel = null;
    return;
  }

  document.querySelectorAll('.selected').forEach(label => {
    if(label === selectedLabel) {
      return true;
    }

    label.classList.remove('selected');

    let j = 0;
    if([...label.childNodes].find(node => node.tagName === 'foreignObject')) {
      j = 1;
    }

    for(let i = label.childNodes.length - 1; i > j; i--) {
      label.removeChild(label.childNodes[i]);
    }
  });

  // 하나도 선택된게 없는 상태
  if(selectedLabel === null) {
    selectedLabelsInfo = [];
  }// 딱 한개만 선택된 상태
  else {
    let transform = selectedLabel.getAttribute('transform').split(' ');
    let x = parseFloat(transform[0].substring(10));
    let y = parseFloat(transform[1].split(')')[0]);
    let deg = parseInt(transform[3].substring(7));
    let rotX = parseFloat(transform[4]);
    let rotY = parseFloat(transform[5].split(')')[0]);
    selectedLabelsInfo = [{id: selectedLabel.dataset.id, preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY}];
  }

  selectedLabel = null;
}


const updateIds = () => {
  let _ids = [];

  document.querySelectorAll('.selected').forEach(label => {
    _ids.push(label.dataset.id);
  });

  selectedLabelIds = _ids;
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
  };
};