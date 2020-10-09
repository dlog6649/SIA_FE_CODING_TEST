import React, { ReactChildren, useEffect } from "react";
import "./Button.scss";

type Props = {
  id?: string | number;
  className?: string;
  onClick?: any;
  children?: any;
  type?: string;
};

export default function Button(props: Props) {
  const className = !props.className ? "btn" : "btn " + props.className;

  return (
    <button className={className} type={"button"} data-type={props.type} onClick={props.onClick}>
      <span>{props.children}</span>
    </button>
  );
}
