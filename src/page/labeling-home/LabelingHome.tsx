import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import CardItem from "../../component/molecules/card-item/CardItem";
import "./LabelingHome.scss";

const title = "Labeling Home";
const url = "https://jsonplaceholder.typicode.com/photos";
const proxyurl = "https://cors-anywhere.herokuapp.com/";

type Scene = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export default function LabelingHome() {
  const [sceneList, setSceneList] = useState<Scene[]>([]);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const photos: Scene[] = [];
        for (let i = 0; i < 8; i++) {
          photos.push(json[i]);
        }
        setSceneList(photos);
      })
      .catch((error) => alert(`fetch failed\nerror: ${error}`));
  }, []);

  const viewScene = (evt: any) => {
    if (evt.target.className !== "thumbnail") {
      return;
    }
    const url = evt.target.dataset.url;
    const title = evt.target.dataset.title;
    // dispatch(viewImage({ url: url, title: title }));
    history.push("/view");
  };

  return (
    <div className={"labeling-home"}>
      <header className={"title"}>{title}</header>
      <main className={"card-item-box"}>
        {sceneList.map((scene: Scene) => (
          <CardItem key={scene.id} id={scene.id} title={scene.title} url={scene.url} thumbnailUrl={scene.thumbnailUrl} />
        ))}
      </main>
    </div>
  );
}
