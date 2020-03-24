import { _props } from './components/LabelBoard';
import { LABEL_SELECT_MODE, LABEL_CREATE_MODE } from './modules/annotator';

const svgNS = 'http://www.w3.org/2000/svg';

var mode = LABEL_SELECT_MODE;

var isDrawing = false;
var isDragging = false;
var isPushingSpacebar = false;
export var isPushingCtrl = false;


var svg;
var mainG;

var rect;

var startX;
var startY;
var oriX;
var oriY;

var oldDegree;
var oldRotX;
var oldRotY;

var selectedG;

var oldWidth;
var oldHeight;

var labels = [];

var ids = [];

var curId;

var curLabel;

var curImgURL;


//   9
// 0 1 2
// 7 8 3
// 6 5 4
const cursorList = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];
var selectedHandlerNo;


export const getLabels = () => {
  return labels;
}

export const setIds = _ids => {
  console.log('label.setIds');

  deleteAnchors();

  ids = _ids;

  ids.forEach(id => {
    //labels.forEach or  // 아마 이건.. 안될듯.
    document.querySelectorAll('.label').forEach(label => {
      if(id === label.dataset.id) {
        createAnchors(label);
      }
    });
  });
}

export const setMode = _mode => {
  console.log('label.setMode');

  if(mode === _mode) {
    return;
  }

  mode = _mode;

  document.querySelectorAll('.label').forEach(node => {
    mode === LABEL_SELECT_MODE ? node.firstChild.setAttribute('cursor', 'move') : node.firstChild.setAttribute('cursor', 'auto');
  });

  
  curLabel = null;
  deleteAnchors();
  updateIds();
}

export const initialize = () => {
  console.log('initializing');

  document.addEventListener('keydown', documentKeydownEvent);
  document.addEventListener('keyup', documentKeyupEvent);
  document.addEventListener('mouseup', documentMouseupEvent);

  svg = document.querySelector('#svg');
  mainG = document.querySelector('#mainG');
  svg.addEventListener('mousedown', svgMousedownEvent);
  svg.addEventListener('mousemove', svgMousemoveEvent);

  labels = _props.labels;
  labels.length === 0 ? curId = 0 : curId = labels[labels.length - 1].id + 1;
}

export const finalize = () => {
  console.log('finalizing');
  
  document.removeEventListener('keydown', documentKeydownEvent);
  document.removeEventListener('keyup', documentKeyupEvent);
  document.removeEventListener('mouseup', documentMouseupEvent);
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
      mainG.removeChild(label);
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

const documentMouseupEvent = e => {
  console.log('document.onmouseup');

  
  if(isDrawing && mode === LABEL_CREATE_MODE){
    //console.log('making');
    let label = curLabel.firstChild;

    if(label.getAttribute('width') < 10 || label.getAttribute('height') < 10) {
      mainG.removeChild(label.parentNode);
    }
    else {
      let transForm = label.parentNode.getAttribute('transform').split(' ');
      let _x = Number(transForm[0].substring(10));
      let _y = Number(transForm[1].split(')')[0]);
      let width = Number(label.getAttribute('width'));
      let height = Number(label.getAttribute('height'));

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
          label.parentNode.dataset.name = e.target.value;
          label.parentNode.removeChild(inputWrapper);
          _props.createLabel(label.parentNode);
        }
      });
      
      label.parentNode.dataset.id = curId++;

      // coordinates
      // 0 1
      // 3 2
      label.parentNode.dataset.xCoordinate0 = _x;
      label.parentNode.dataset.yCoordinate0 = _y;
      label.parentNode.dataset.xCoordinate1 = _x + width;
      label.parentNode.dataset.yCoordinate1 = _y;
      label.parentNode.dataset.xCoordinate2 = _x + width;
      label.parentNode.dataset.yCoordinate2 = _y + height;
      label.parentNode.dataset.xCoordinate3 = _x;
      label.parentNode.dataset.yCoordinate3 = _y + height;

      inputWrapper.appendChild(input);
      label.parentNode.appendChild(inputWrapper);
    }
  }
  else if(isDragging && mode === LABEL_SELECT_MODE) {

    let transForm = curLabel.getAttribute('transform').split(' ');
    let x = Number(transForm[0].substring(10));
    let y = Number(transForm[1].split(')')[0]);
    let width = Number(curLabel.firstChild.getAttribute('width'));
    let height = Number(curLabel.firstChild.getAttribute('height'));

    curLabel.dataset.xCoordinate0 = x;
    curLabel.dataset.yCoordinate0 = y;
    curLabel.dataset.xCoordinate1 = x + width;
    curLabel.dataset.yCoordinate1 = y;
    curLabel.dataset.xCoordinate2 = x + width;
    curLabel.dataset.yCoordinate2 = y + height;
    curLabel.dataset.xCoordinate3 = x;
    curLabel.dataset.yCoordinate3 = y + height;

    _props.updateLabels(document.querySelectorAll('.label'));
  }
  
  isDrawing = false;
  isDragging = false;
}


const svgMousedownEvent = e => {
  console.log('svg mousedown');

  if(isPushingSpacebar) {
    
  }
  else if(mode === LABEL_CREATE_MODE) {
    isDrawing = true;
    
    startX = e.offsetX;
    startY = e.offsetY;

    curLabel = document.createElementNS(svgNS, "g");
    curLabel.setAttribute('transform', 'translate('+startX+' '+startY+') rotate(0 0 0)');
    curLabel.classList.add('label');

    rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute('width', 0);
    rect.setAttribute('height', 0);
    rect.setAttribute('fill', '#5c6dda');
    rect.setAttribute('fill-opacity', '0.2');
    rect.setAttribute('stroke', '#5c6dda');
    rect.setAttribute('stroke-width', 3);
    // rect.addEventListener('click', e => {
    //   e.stopPropagation();
    //   console.log('label click');
    // });
    rect.addEventListener('mousedown', e => {
      console.log('label mousedown');

      if(mode === LABEL_CREATE_MODE || e.ctrlKey) {
        return;
      }

      oriX = e.offsetX;
      oriY = e.offsetY;
      //console.log(oriX, oriY);
      selectedHandlerNo = 8;

      curLabel = e.target.parentNode;

      let transForm = curLabel.getAttribute('transform').split(' ');
      startX = Number(transForm[0].substring(10));
      startY = Number(transForm[1].split(')')[0]);

      curLabel.classList.add('selected');

      oldDegree = parseFloat(transForm[2].substring(7));
      oldRotX = Number(transForm[3]);
      oldRotY = Number(transForm[4].split(')')[0]);

      isDragging = true;

      // 이미 앵커가 있으면 리턴
      if(e.target.parentNode.childNodes.length > 2){
        return;
      }
      else {
        createAnchors(e.target.parentNode);
      }
    });

    curLabel.appendChild(rect);
    mainG.appendChild(curLabel);
  }
  else if(mode === LABEL_SELECT_MODE) {
    deleteAnchors();
    updateIds();
  }
}

const svgMousemoveEvent = e => {

  if (isDrawing && mode === LABEL_CREATE_MODE) {
    console.log('LABEL_CREATE_MODE mousemove');

    let endX = e.offsetX;
    let endY = e.offsetY;

    let x = startX < endX ? startX : endX;
    let y = startY < endY ? startY : endY;

    let width = startX > endX ? startX - endX : endX - startX;
    let height = startY > endY ? startY - endY : endY - startY;

    curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate(0 '+width*.5+' '+height*.5+')');
    curLabel.firstChild.setAttribute('width', width);
    curLabel.firstChild.setAttribute('height', height);
  }
  else if (isDragging && mode === LABEL_SELECT_MODE) {
    console.log('LABEL_SELECT_MODE mousemove');
    
    let endX = e.offsetX;
    let endY = e.offsetY;

    let x, y, width, height;
    
    curLabel = e.target.parentNode;

    let rect = curLabel.firstChild;

    switch(selectedHandlerNo) {
      case 0:
        x = startX + oldWidth > endX ? endX : startX + oldWidth;
        y = startY + oldHeight > endY ? endY : startY + oldHeight;
        width = startX + oldWidth > endX ? startX + oldWidth - endX : endX - (startX + oldWidth);
        height = startY + oldHeight > endY ? startY + oldHeight - endY : endY - (startY + oldHeight);
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        break;
      case 1:
        x = startX;
        y = startY + oldHeight > endY ? endY : startY + oldHeight;
        width = oldWidth;
        height = startY + oldHeight > endY ? startY + oldHeight - endY : endY - (startY + oldHeight);
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('height', height);
        break;
      case 2:
        x = startX < endX ? startX : endX;
        y = startY + oldHeight > endY ? endY : startY + oldHeight;
        width = startX > endX ? startX - endX : endX - startX;
        height = startY + oldHeight > endY ? startY + oldHeight - endY : endY - (startY + oldHeight);
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        break;
      case 3:
        x = startX < endX ? startX : endX;
        y = startY;
        width = startX > endX ? startX - endX : endX - startX;
        height = oldHeight;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        break;
      case 4:
        x = startX < endX ? startX : endX;
        y = startY < endY ? startY : endY;
        width = startX > endX ? startX - endX : endX - startX;
        height = startY > endY ? startY - endY : endY - startY;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        break;
      case 5:
        x = startX;
        y = startY < endY ? startY : endY;
        width = oldWidth;
        height = startY > endY ? startY - endY : endY - startY;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('height', height);
        break;
      case 6:
        x = startX + oldWidth > endX ? endX : startX + oldWidth;
        y = startY < endY ? startY : endY;
        width = startX + oldWidth > endX ? startX + oldWidth - endX : endX - (startX + oldWidth);
        height = startY > endY ? startY - endY : endY - startY;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        break;
      case 7:
        x = startX + oldWidth > endX ? endX : startX + oldWidth;
        y = startY;
        width = startX + oldWidth > endX ? startX + oldWidth - endX : endX - (startX + oldWidth);
        height = oldHeight;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        break;
      case 8:
        // selectedLabels.forEach(ele => {
        //   let transForm = ele.getAttribute('transform').split(' ');
        //   startX = Number(transForm[0].substring(10));
        //   startY = Number(transForm[1].split(')')[0]);
        //});
        // document.querySelectorAll('.selected').forEach(ele => {
        //   let transForm = ele.getAttribute('transform').split(' ');
        //   startX = Number(transForm[0].substring(10));
        //   startY = Number(transForm[1].split(')')[0]);
          
          x = startX + endX - oriX;
          y = startY + endY - oriY;

          // console.log(startX, startY, endX, endY, x, y, oriX, oriY);
          //debugger;


          // let cloneEle = ele.cloneNode();
          // cloneEle.classList.add('selected');
          // cloneEle.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+oldRotX+' '+oldRotY+')')

          
          // svg.removeChild(ele);
          // svg.appendChild(cloneEle);

          

          curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+oldRotX+' '+oldRotY+')')
        //});
        break;
      case 9:
        x = startX;
        y = startY;
        var degree = (Math.atan2(parseFloat(endY) - parseFloat((startY + oldRotY)), parseFloat(endX) - parseFloat((startX + oldRotX))) * 180 / 3.1415) + 90;
        curLabel.setAttribute('transform', 'translate('+x+' '+y+') rotate('+degree+' '+oldRotX+' '+oldRotY+')');
        break;
    }


    updateAnchors(rect);

  }
}

const createAnchors = label => {
  console.log('createAnchors');

  let width = label.firstChild.getAttribute('width');
  let height = label.firstChild.getAttribute('height');

  label.classList.add('selected');

  
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
    e.stopPropagation();

    curLabel = selectedG = e.target.parentNode;
    selectedHandlerNo = 9;

    oriX = e.offsetX;
    oriY = e.offsetY;

    let transForm = selectedG.getAttribute('transform').split(' ');
    startX = Number(transForm[0].substring(10));
    startY = Number(transForm[1].split(')')[0]);

    oldRotX = Number(transForm[3]);
    oldRotY = Number(transForm[4].split(')')[0]);

    isDragging = true;
  });

  label.appendChild(circle);

  const anchorPosXList = [-7, width*.5-5, width-3, width-3, width-3, width*.5-5, -7, -7];
  const anchorPosYList = [-7, -7, -7, height*.5-5, height-3, height-3, height-3, height*.5-5];
  let anchor;

  for(let i = 0; i < 8; i++){
    anchor = document.createElementNS(svgNS, "rect");
    anchor.setAttribute('x', anchorPosXList[i]);
    anchor.setAttribute('y', anchorPosYList[i]);
    anchor.setAttribute('cursor', cursorList[i]);
    anchor.setAttribute('width', 10);
    anchor.setAttribute('height', 10);
    anchor.setAttribute('fill', 'white');
    anchor.setAttribute('stroke', '#5c6dda');
    anchor.setAttribute('stroke-width', 3);
    anchor.addEventListener('mousedown', e => {
      e.stopPropagation();
      console.log('anchor mousedown');
      
      curLabel = selectedG = e.target.parentNode;
      selectedHandlerNo = i;
      
      let transForm = selectedG.getAttribute('transform').split(' ');
      startX = Number(transForm[0].substring(10));
      startY = Number(transForm[1].split(')')[0]);

      oldDegree = parseFloat(transForm[2].substring(7));

      oldWidth = Number(selectedG.firstChild.getAttribute('width'));
      oldHeight = Number(selectedG.firstChild.getAttribute('height'));

      isDragging = true;
    });

    label.appendChild(anchor);
  }
}

const updateAnchors = node => {
  console.log('updateAnchors');

  const width = node.getAttribute('width');
  const height = node.getAttribute('height');

  let anchorPosXList = [-7, width*.5-5, width-3, width-3, width-3, width*.5-5, -7, -7];
  let anchorPosYList = [-7, -7, -7, height*.5-5, height-3, height-3, height-3, height*.5-5];

  let i = 0;
  while(node.nextSibling){
    node = node.nextSibling;
    if(node.tagName === 'line') {
      node.setAttribute('x1', width*.5);
      node.setAttribute('x2', width*.5);
    }
    else if(node.tagName === 'circle') {
      node.setAttribute('cx', width*.5);
    }
    else if(node.tagName === 'rect') {
      node.setAttribute('x', anchorPosXList[i]);
      node.setAttribute('y', anchorPosYList[i]);
      i++;
    }
  }
}



const deleteAnchors = () => {
  console.log('deleteAnchors\nmode: ', mode, '\nisPushingCtrl: ', isPushingCtrl);

  if(isPushingCtrl) {
    curLabel = null;
    return;
  }

  document.querySelectorAll('.selected').forEach(label => {
    if(label === curLabel) {
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

  curLabel = null;
}


const updateIds = () => {
  let _ids = []

  document.querySelectorAll('.selected').forEach(label => {
    _ids.push(label.dataset.id);
  });

  ids = _ids;

  _props.selectLabels(ids);
}