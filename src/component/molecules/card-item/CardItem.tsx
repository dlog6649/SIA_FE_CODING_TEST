import React from "react";

import "./CardItem.scss";

type Props = {
  id: number | string;
  text: string;
  url: string;
  thumbnailUrl: string;
  onClick?: any;
};

export default function CardItem(props: Props) {
  return (
    <div className={"card-item"} title={props.text} onClick={props.onClick} data-id={props.id} data-url={props.url} data-title={props.text}>
      <img className={"thumbnail"} src={props.thumbnailUrl} />
      <div className={"text"}>{props.text}</div>
    </div>
  );
}
