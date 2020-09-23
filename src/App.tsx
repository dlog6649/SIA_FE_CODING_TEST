import React, { useEffect } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import LabelingHome from "./page/labeling-home/LabelingHome";
import LabelingView from "./page/labeling-view/LabelingView";
import Button from "./component/atoms/button/Button";

import "./style/layout.scss";
import "./App.scss";

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

let canDrag = false;
let isDragging = false;
let isDragging2 = false;
let startX: number;
let startY: number;
let div1Width: number;
let div2Width: number;
let div3Width: number;
let div1Height: number;
let div2Height: number;
let div3Height: number;

export default function App() {
  useEffect(() => {
    document.addEventListener("mousedown", pauseEvent);
    document.addEventListener("mouseup", () => {
      isDragging = false;
      isDragging2 = false;
    });

    const div1 = document.querySelector("#div1") as HTMLElement;
    const div2 = document.querySelector("#div2") as HTMLElement;
    const div3 = document.querySelector("#div3") as HTMLElement;
    // const edge1 = document.querySelector("#edge1") as HTMLElement;
    // const edge2 = document.querySelector("#edge2") as HTMLElement;
    const app = document.querySelector(".app") as HTMLElement;

    app.addEventListener("mousemove", (evt) => {
      const s = Number(window.getComputedStyle(div1).width.split("px")[0]);
      if (s < evt.clientX && s + 4 > evt.clientX) {
        app.style.cursor = "col-resize";
        canDrag = true;
      } else {
        app.style.cursor = "auto";
        canDrag = false;
      }
    });
    app.addEventListener("mousedown", (evt) => {
      if (canDrag) {
        isDragging = true;
        startX = evt.clientX;
        div1Width = Number(div1.style.width.split("px")[0]);
        div2Width = Number(div2.style.width.split("px")[0]);
        div3Width = Number(div3.style.width.split("px")[0]);
      }
    });

    // edge1.style.cursor = "col-resize";
    // edge2.style.cursor = "row-resize";
    div1.style.width = window.getComputedStyle(div1).width;
    div2.style.width = window.getComputedStyle(div2).width;
    div3.style.width = window.getComputedStyle(div3).width;
    div1.style.height = window.getComputedStyle(div1).height;
    div2.style.height = window.getComputedStyle(div2).height;
    div3.style.height = window.getComputedStyle(div3).height;

    // edge1.addEventListener("mousedown", (evt) => {
    //   isDragging = true;
    //   startX = evt.clientX;
    //   div1Width = Number(div1.style.width.split("px")[0]);
    //   div2Width = Number(div2.style.width.split("px")[0]);
    //   div3Width = Number(div3.style.width.split("px")[0]);
    // });
    // edge2.addEventListener("mousedown", (evt) => {
    //   isDragging2 = true;
    //   startY = evt.clientY;
    //   div2Height = Number(div2.style.height.split("px")[0]);
    //   div3Height = Number(div3.style.height.split("px")[0]);
    // });
    app.addEventListener("mousemove", (evt: any) => {
      if (isDragging) {
        div1.style.width = `${evt.clientX - startX + div1Width}px`;
        div2.style.width = `${startX - evt.clientX + div2Width}px`;
        div3.style.width = `${startX - evt.clientX + div3Width}px`;
      } else if (isDragging2) {
        div2.style.height = `${evt.clientY - startY + div2Height}px`;
        div3.style.height = `${startY - evt.clientY + div3Height}px`;
      }
    });
  }, []);
  return (
    <div className="app">
      <div id={"div1"}>1</div>
      <div id={"div2"}>2</div>
      <div id={"div3"}>3</div>
      {/* <div id={"edge1"} />
      <div id={"edge2"} /> */}
      {/* <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div> */}
      {/* <Button>common button</Button> */}
      {/* <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LabelingHome} />
          <Route path="/view" component={LabelingView} />
        </Switch>
      </BrowserRouter> */}
    </div>
  );
}
