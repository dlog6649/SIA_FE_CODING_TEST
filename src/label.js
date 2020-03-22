const svgNS = 'http://www.w3.org/2000/svg';
const LABEL_SELECT_MODE = 'LABEL_SELECT_MODE'
const LABEL_CREATE_MODE = 'LABEL_CREATE_MODE'

var mode = LABEL_SELECT_MODE;

var isDrawing = false;
var isDragging = false;
var isPushingSpacebar = false;


var svg;
var g;
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

var selectedLabelList = [];

var selectedLabels = [];

//   9
// 0 1 2
// 7 8 3
// 6 5 4
const cursorList = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];
var selectedHandlerNo;

// 레이블 생성 후 또는 레이블 클릭 후 앵커 제거 방지
var latestLabel = null;

export const getLabels = () => {
  return labels;
}

export const setSelectedLabelList = (_selectedLabelList) => {
  selectedLabels = _selectedLabelList;
}

export const setMode = _mode => {
  mode = _mode;
}

export const initialize = () => {
  console.log('initializing');

  document.addEventListener('keydown', documentKeydownEvent);
  document.addEventListener('keyup', documentKeyupEvent);
  document.addEventListener('mouseup', documentMouseupEvent);

  svg = document.querySelector('#svg');
  svg.addEventListener('click', deleteAnchors);
  svg.addEventListener('mousedown', svgMousedownEvent);
  svg.addEventListener('mousemove', svgMousemoveEvent);
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
  else if(e.keyCode === 46 || e.keyCode === 8) {
    let selectedLabels = document.querySelectorAll('.selected');
    selectedLabels.forEach(node => {
      svg.removeChild(node);
    });
  };
}

const documentKeyupEvent = e => {
  if(e.keyCode === 32) {
    isPushingSpacebar = false;
  }
}

const documentMouseupEvent = e => {
  console.log('document.onmouseup');
  
  if(isDrawing && e.target.tagName === 'rect'){
    let label = e.target;

    if(label.getAttribute('width') < 10 || label.getAttribute('height') < 10) {
      svg.removeChild(label.parentNode);
    }
    else {
      createAnchors(label);
      latestLabel = label.parentNode;

      let newLabels = []
      document.querySelectorAll('.label').forEach(node => {

        let transForm = node.getAttribute('transform').split(' ');
        let _x = Number(transForm[0].substring(10));
        let _y = Number(transForm[1].split(')')[0]);
        let width = Number(node.firstChild.getAttribute('width'));
        let height = Number(node.firstChild.getAttribute('height'));

        let label = {};
        label.class = node.dataset.class;
        label.coordinate = [
          {x:_x, y:_y}
          ,{x:_x + width, y:_y}
          ,{x:_x, y:_y + height}
          ,{x:_x + width, y:_y + height}
        ];
        newLabels.push(label);
      });
      labels = newLabels;
    }
  }
  
  isDrawing = false;
  isDragging = false;
}


const svgMousedownEvent = (e) => {
  console.log('svg mousedown');

  if(isPushingSpacebar) {
    
  }
  else {
    isDrawing = true;
    
    startX = e.offsetX;
    startY = e.offsetY;

    g = document.createElementNS(svgNS, "g");
    g.setAttribute('transform', 'translate('+startX+' '+startY+') rotate(0 0 0)');
    g.classList.add('label');

    rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute('width', 0);
    rect.setAttribute('height', 0);
    rect.setAttribute('fill', '#5c6dda');
    rect.setAttribute('fill-opacity', '0.2');
    rect.setAttribute('stroke', '#5c6dda');
    rect.setAttribute('stroke-width', 3);
    rect.setAttribute('cursor', 'move');
    rect.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('label click');
    });
    rect.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      console.log('label mousedown');

      oriX = e.offsetX;
      oriY = e.offsetY;
      console.log(oriX, oriY);
      selectedHandlerNo = 8;

      selectedG = e.target.parentNode;

      let transForm = selectedG.getAttribute('transform').split(' ');
      startX = Number(transForm[0].substring(10));
      startY = Number(transForm[1].split(')')[0]);

      selectedLabelList.push(selectedG);

      oldDegree = parseFloat(transForm[2].substring(7));
      oldRotX = Number(transForm[3]);
      oldRotY = Number(transForm[4].split(')')[0]);

      isDragging = true;

      // 이미 앵커가 있으면 리턴
      if(e.target.nextSibling){
        return;
      }

      createAnchors(e.target);

      // 컨트롤키 누르고 클릭 시 다중선택
      if(!e.ctrlKey) {
        latestLabel = e.target.parentNode;
        deleteAnchors(e.target);
      }

    });

    g.appendChild(rect);
    svg.appendChild(g);
  }
}

const svgMousemoveEvent = e => {

  if(isDrawing) {
    console.log('isDrawing mousemove');

    let endX = e.offsetX;
    let endY = e.offsetY;

    let x = startX < endX ? startX : endX;
    let y = startY < endY ? startY : endY;

    let width = startX > endX ? startX - endX : endX - startX;
    let height = startY > endY ? startY - endY : endY - startY;

    g.setAttribute('transform', 'translate('+x+' '+y+') rotate(0 '+width*.5+' '+height*.5+')');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
  }
  else if(isDragging) {
    //console.log('isDragging mousemove');
    
    let endX = e.offsetX;
    let endY = e.offsetY;

    let x, y, width, height;
    
    let rect = selectedG.firstChild;

    switch(selectedHandlerNo) {
      case 0:
        x = startX + oldWidth > endX ? endX : startX + oldWidth;
        y = startY + oldHeight > endY ? endY : startY + oldHeight;
        width = startX + oldWidth > endX ? startX + oldWidth - endX : endX - (startX + oldWidth);
        height = startY + oldHeight > endY ? startY + oldHeight - endY : endY - (startY + oldHeight);
        selectedG.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        break;
      case 1:
        x = startX;
        y = startY + oldHeight > endY ? endY : startY + oldHeight;
        width = oldWidth;
        height = startY + oldHeight > endY ? startY + oldHeight - endY : endY - (startY + oldHeight);
        selectedG.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('height', height);
        break;
      case 2:
        x = startX < endX ? startX : endX;
        y = startY + oldHeight > endY ? endY : startY + oldHeight;
        width = startX > endX ? startX - endX : endX - startX;
        height = startY + oldHeight > endY ? startY + oldHeight - endY : endY - (startY + oldHeight);
        selectedG.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        break;
      case 3:
        x = startX < endX ? startX : endX;
        y = startY;
        width = startX > endX ? startX - endX : endX - startX;
        height = oldHeight;
        selectedG.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        break;
      case 4:
        x = startX < endX ? startX : endX;
        y = startY < endY ? startY : endY;
        width = startX > endX ? startX - endX : endX - startX;
        height = startY > endY ? startY - endY : endY - startY;
        selectedG.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        break;
      case 5:
        x = startX;
        y = startY < endY ? startY : endY;
        width = oldWidth;
        height = startY > endY ? startY - endY : endY - startY;
        selectedG.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('height', height);
        break;
      case 6:
        x = startX + oldWidth > endX ? endX : startX + oldWidth;
        y = startY < endY ? startY : endY;
        width = startX + oldWidth > endX ? startX + oldWidth - endX : endX - (startX + oldWidth);
        height = startY > endY ? startY - endY : endY - startY;
        selectedG.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        break;
      case 7:
        x = startX + oldWidth > endX ? endX : startX + oldWidth;
        y = startY;
        width = startX + oldWidth > endX ? startX + oldWidth - endX : endX - (startX + oldWidth);
        height = oldHeight;
        selectedG.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+width*.5+' '+height*.5+')');
        rect.setAttribute('width', width);
        break;
      case 8:
        // selectedLabelList.forEach(ele => {
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

          

          selectedG.setAttribute('transform', 'translate('+x+' '+y+') rotate('+oldDegree+' '+oldRotX+' '+oldRotY+')')
        //});
        break;
      case 9:
        var degree = (Math.atan2(parseFloat(endY) - parseFloat((startY + oldRotY)), parseFloat(endX) - parseFloat((startX + oldRotX))) * 180 / 3.1415) + 90;
        selectedG.setAttribute('transform', 'translate('+startX+' '+startY+') rotate('+degree+' '+oldRotX+' '+oldRotY+')');
        break;
    }
    updateAnchors(rect);
  }
}

const createAnchors = (node) => {
  console.log('createAnchors');

  const g = node.parentNode;
  const width = node.getAttribute('width');
  const height = node.getAttribute('height');

  g.classList.add('selected');

  
  let line = document.createElementNS(svgNS, "line");
  line.setAttribute('x1', width*.5);
  line.setAttribute('y1', 0);
  line.setAttribute('x2', width*.5);
  line.setAttribute('y2', -25);
  line.setAttribute('stroke', '#5c6dda');
  line.setAttribute('stroke-width', 3);
  g.appendChild(line);

  let circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute('cx', width*.5);
  circle.setAttribute('cy', -25);
  circle.setAttribute('r', 5);
  circle.setAttribute('cursor', 'Crosshair');
  circle.setAttribute('fill', 'white');
  circle.setAttribute('stroke', '#5c6dda');
  circle.setAttribute('stroke-width', 3);
  circle.addEventListener('mousedown', (e) => {
    e.stopPropagation();

    selectedG = e.target.parentNode;
    latestLabel = selectedG;
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

  g.appendChild(circle);

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
    anchor.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      console.log('anchor mousedown');
      
      selectedG = e.target.parentNode;
      selectedHandlerNo = i;
      latestLabel = selectedG;
      
      let transForm = selectedG.getAttribute('transform').split(' ');
      startX = Number(transForm[0].substring(10));
      startY = Number(transForm[1].split(')')[0]);

      oldDegree = parseFloat(transForm[2].substring(7));

      oldWidth = Number(selectedG.firstChild.getAttribute('width'));
      oldHeight = Number(selectedG.firstChild.getAttribute('height'));

      isDragging = true;
    });

    g.appendChild(anchor);
  }
}

const updateAnchors = (node) => {
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

    const deleteAnchors = (e) => {
    console.log('canvas onclick - deleteAnchors');
    
    // console.log(e); // e가 undefined되면서 에러뜨는 버그
    // 다른곳에선 mousedown시 호출해서 그때는 이벤트(e)가 안들어감.
    // 수정필요

    let children = svg.children;

    for(let i = 0; i < children.length; i++){

      if(children[i] === latestLabel){
        continue;
      }
      if(children[i].children.length <= 1){
        continue;
      }

      children[i].classList.remove('selected');

      
      let idx = selectedLabelList.findIndex((ele) => {
        return ele === children[i];
      });
      selectedLabelList.splice(idx, 1);
      //console.log(selectedLabelList);

      for(let j = children[i].children.length - 1; j > 0; j--){
        children[i].removeChild(children[i].children[j]);
      }
    }
    
    latestLabel = null;
}


