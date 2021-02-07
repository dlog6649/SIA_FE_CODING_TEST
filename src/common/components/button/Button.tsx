import React, { ReactChildren, useEffect } from "react";
import styles from "./Button.module.scss";
import cn from "classnames";

type Props = {
  id?: string | number;
  className?: string;
  onClick?: any;
  children?: any;
  type?: string;
};

export default function Button(props: Props) {
  return (
    <button className={cn(styles.button, props.className)} type={"button"} data-type={props.type} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
