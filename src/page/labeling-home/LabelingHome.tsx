import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import CardItem from "../../component/molecules/card-item/CardItem";
import * as routes from "../../Routes";
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
        for (let i = 0; i < 12; i++) {
          photos.push(json[i]);
        }
        setSceneList(photos);
      })
      .catch((error) => alert(`fetch failed\nerror: ${error}`));
  }, []);

  const viewScene = (evt: any) => {
    const url = evt.currentTarget.dataset.url;
    const title = evt.currentTarget.dataset.title;
    // dispatch(viewImage({ url: url, title: title }));
    history.push(routes.labelingView); // 이것을 /view:id로 또는 <Link /> 컴포넌트로 하는것에 대해 고찰.
  };

  return (
    <div className={"labeling-home"}>
      <header className={"title"}>{title}</header>
      <main className={"card-item-box"}>
        {sceneList.map((scene: Scene) => (
          <CardItem key={scene.id} id={scene.id} text={scene.title} url={scene.url} thumbnailUrl={scene.thumbnailUrl} onClick={viewScene} />
        ))}
      </main>
    </div>
  );
}
