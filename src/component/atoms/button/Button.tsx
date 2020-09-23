import React, { ReactChildren, useEffect } from "react";
import "./Button.scss";

type Props = {
  id?: string;
  className?: string;
  onClick?: (evt?: any) => void;
  children?: any;
};

export default function Button(props: Props) {
  const className = !props.className ? "btn" : "btn " + props.className;

  return (
    <button className={className} type={"button"} onClick={props.onClick}>
      <span>{props.children}</span>
    </button>
  );
}
