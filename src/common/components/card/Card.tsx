import React from "react";

import "./Card.scss";

// TODO: HTMLProps 상속
type Props = {
  id: number | string;
  text: string;
  url: string;
  thumbnailUrl: string;
  onClick?: any;
};

export default function Card(props: Props) {
  return (
    <figure className={"card"} title={props.text} onClick={props.onClick} data-id={props.id} data-url={props.url} data-title={props.text}>
      <img className={"thumbnail"} src={props.thumbnailUrl} />
      <div className={"text"}>{props.text}</div>
    </figure>
  );
}
