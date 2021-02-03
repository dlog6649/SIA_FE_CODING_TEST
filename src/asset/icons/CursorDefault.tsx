import React from "react";

import { IconBase } from "./IconBase";

export function CursorDefault(props: React.HTMLProps<HTMLSpanElement>) {
  return (
    <span role={"img"} {...props}>
      <IconBase viewBox={"0 0 40 40"} d={"M8,0l8,19.237L8,16.344,0,19.237Z"} transform={"translate(6 13) rotate(-30)"} />
    </span>
  );
}
