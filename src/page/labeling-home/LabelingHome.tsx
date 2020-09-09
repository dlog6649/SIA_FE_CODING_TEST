import React, { useEffect } from "react";
import CardItemBoxContainer from "../../container/CardItemBoxContainer";
import "./LabelingHome.scss";

export default function LabelingHome() {
  const title = "Labeling Home";
  useEffect(() => {
    console.log("Labeling useEffect");
  });
  return (
    <div className="labeling-home">
      <div className="title">{title}</div>
      <div className="content">
        <CardItemBoxContainer />
      </div>
    </div>
  );
}
