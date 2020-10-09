import React, { useEffect } from "react";

import Button from "../atoms/button/Button";

import "./ContentTitle.scss";

interface Props {
  title: string;
}

export default function ContentTitle({ title }: Props) {
  useEffect(() => {
    console.log("AnnotatorAnnotatingLabel useEffect");
  });

  return <div className="content-title">{title}</div>;
}
