import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import LabelBoard from "../container/LabelBoard";
import LabelList from "../container/LabelList";
import LabelMode from "../container/LabelMode";
import arrowLeft from "../asset/images/arrow-left.png";

interface Props {
  title: string;
}

export default function AnnotatorAnnotatingLabel({ title }: Props) {
  useEffect(() => {
    console.log("AnnotatorAnnotatingLabel useEffect");
  });

  return (
    <div className="viewer">
      <Link to="/">
        <img src={arrowLeft} alt="home" />
      </Link>
      <div className="viewer-title">{title}</div>
      <div className="viewer-content">
        <LabelMode />
        <LabelList />
        <LabelBoard />
      </div>
    </div>
  );
}
