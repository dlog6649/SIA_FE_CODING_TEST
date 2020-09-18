import React, { ReactChildren, useEffect } from "react";

type Props = {
  className?: string;
  onClick?: (evt?: any) => void;
  children: any;
};

export default function Button(props: Props) {
  useEffect(() => {
    console.log("useEffect");
  });

  const className = !props.className ? "btn" : "btn " + props.className;

  return (
    <button className={className} type={"button"} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
