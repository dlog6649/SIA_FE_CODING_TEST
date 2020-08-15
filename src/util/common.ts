const tagNm = {
  LINE: "line",
  CIRCLE: "circle",
  RECT: "rect",
  TEXT: "text",
  FOREIGNOBJECT: "foreignObject",
  IMAGE: "image",
  G: "g",
  SPAN: "SPAN",
};

export const parseTransform = (obj: any) => {
  if (obj.tagName === tagNm.IMAGE) {
    const transform = obj.getAttribute("transform").split(" ");
    const x = parseFloat(transform[0].substring(10));
    const y = parseFloat(transform[1].split(")")[0]);
    const scale = parseFloat(transform[2].substring(6).split(")")[0]);
    return { x, y, scale };
  }
  if (obj.tagName === tagNm.G) {
    const transform = obj.getAttribute("transform").split(" ");
    const x = parseFloat(transform[0].substring(10));
    const y = parseFloat(transform[1].split(")")[0]);
    const scale = parseFloat(transform[2].substring(6).split(")")[0]);
    const deg = parseInt(transform[3].substring(7));
    const rotX = parseFloat(transform[4]);
    const rotY = parseFloat(transform[5].split(")")[0]);
    const w = parseFloat(obj.firstChild.getAttribute("width"));
    const h = parseFloat(obj.firstChild.getAttribute("height"));
    return { x, y, deg, rotX, rotY, w, h, scale };
  }
};

export function throttle(func: any, wait: number, options: any) {
  let context: any;
  let args: IArguments | null;
  let result: any;
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  if (!options) {
    options = {};
  }
  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };

  return function (this: any) {
    const now = Date.now();
    if (!previous && options.leading === false) {
      previous = now;
    }
    const remaining = wait - (now - previous);
    context = this; // if delete 'this' parameter then error occur
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

export const pauseEvent = (evt: any) => {
  if (evt.stopPropagation) {
    evt.stopPropagation();
  }
  if (evt.preventDefault) {
    evt.preventDefault();
  }
  evt.cancelBubble = true;
  evt.returnValue = false;
  return false;
};
