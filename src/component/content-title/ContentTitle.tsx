import React, { useEffect } from "react";

interface Props {
  title: string;
}

export default function AnnotatorAnnotatingLabel({ title }: Props) {
  useEffect(() => {
    console.log("AnnotatorAnnotatingLabel useEffect");
  });

  return <div className="viewer-title">{title}</div>;
}
