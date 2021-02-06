import React from "react";

type Props = {
  viewBox: string;
  d: string;
  transform?: string;
};

export function IconBase(props: Props) {
  return (
    <svg width={"1em"} height={"1em"} fill={"currentColor"} viewBox={props.viewBox} focusable={false} aria-hidden={true}>
      <path d={props.d} transform={props.transform} />
    </svg>
  );
}
