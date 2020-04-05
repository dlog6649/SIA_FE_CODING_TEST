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


export const parseTransform = obj => {
    if (obj.tagName === tagNm.IMAGE) {
      let transform = obj.getAttribute('transform').split(' ');
      let x = parseFloat(transform[0].substring(10));
      let y = parseFloat(transform[1].split(')')[0]);
      let scale = parseFloat(transform[2].substring(6).split(')')[0]);
      return {x: x, y: y, scale: scale}
    }
    else if (obj.tagName === tagNm.G) {
      let transform = obj.getAttribute('transform').split(' ');
      let x = parseFloat(transform[0].substring(10));
      let y = parseFloat(transform[1].split(')')[0]);
      let scale = parseFloat(transform[2].substring(6).split(')')[0]);
      let deg = parseInt(transform[3].substring(7));
      let rotX = parseFloat(transform[4]);
      let rotY = parseFloat(transform[5].split(')')[0]);
      let w = parseFloat(obj.firstChild.getAttribute('width'));
      let h = parseFloat(obj.firstChild.getAttribute('height'));
      return {x: x, y: y, deg: deg, rotX: rotX, rotY: rotY, w: w, h: h, scale: scale};
    }
}