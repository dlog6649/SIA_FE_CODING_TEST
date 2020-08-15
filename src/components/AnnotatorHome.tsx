import React, { useEffect } from "react";
import CardList from "../container/CardList";

export default function AnnotatorHome() {
  useEffect(() => {
    console.log("AnotatorHome useEffect");
  });

  return (
    <div className="home">
      <div className="home-title">
        <h1>Annotator Home</h1>
      </div>
      <div className="home-content">
        <CardList />
      </div>
    </div>
  );
}
