import React, { useEffect } from "react";

export default function AnnotatorHome() {
  useEffect(() => {
    console.log("AnotatorHome useEffect");
  });

  return (
    <div className="home-title">
      <h1>Annotator Home</h1>
    </div>
  );
}
