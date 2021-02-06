import React from "react";

import { IconBase } from "./IconBase";

export function Square(props: React.HTMLProps<HTMLSpanElement>) {
  return (
    <span role={"img"} {...props}>
      <IconBase
        viewBox={"0 0 330 330"}
        d={
          "M315,0H15C6.716,0,0,6.716,0,15v300c0,8.284,6.716,15,15,15h300c8.284,0,15-6.716,15-15V15C330,6.716,323.285,0,315,0z M300,300H30V30h270V300z"
        }
      />
    </span>
  );
}
