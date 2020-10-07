import React, { useEffect } from "react";

import "./CardItem.scss";

type Props = {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  onClick?: any;
};

export default function CardItem(props: Props) {
  return (
    <div className={"card-item"} data-id={props.id} data-url={props.url} data-title={props.title}>
      <section className={"section-thumbnail"}>
        <img className={"thumbnail"} data-testid={"testThumbnail"} src={props.thumbnailUrl} />
      </section>
      <section className={"section-title"} title={props.title}>
        {props.title}
      </section>
    </div>
  );
}
