import React, { useEffect } from "react";

type Props = {
  thumbnailUrl: string;
  url: string;
  title: string;
};

export default function CardItemBox({ thumbnailUrl, url, title }: Props) {
  // useEffect(() => {
  //   console.log("useEffect");
  // });

  return (
    <div className={"card-item"}>
      {/* <div className={"card-thumbnail"}>
        <img className={"thumbnail"} data-testid={"testThumbnail"} src={thumbnailUrl} data-url={url} data-title={title} />
      </div>
      <div className={"card-title"} title={title}>
        {title}
      </div> */}
    </div>
  );
}
