import React, { useEffect } from "react";
import AnnotatorHome from "../component/AnnotatorHome";
import CardListContainer from "./CardListContainer";

export default function AnnotatorHomeContainer() {
  useEffect(() => {
    console.log("AnotatorHome useEffect");
  });
  return (
    <div className="home">
      <AnnotatorHome />
      <div className="home-content">
        <CardListContainer />
      </div>
    </div>
  );
}
