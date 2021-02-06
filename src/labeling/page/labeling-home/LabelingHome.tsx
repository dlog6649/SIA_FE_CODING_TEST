import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Card from "../../../common/components/card/Card";
import styles from "./LabelingHome.module.scss";
import * as routes from "../../../routes";

const title = "Labeling Home";
const url = "https://jsonplaceholder.typicode.com/photos";
const proxyurl = "https://cors-anywhere.herokuapp.com/";

type Scene = {
  albumId: number;
  id: string;
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

  const viewScene = (id: string) => (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const url = evt.currentTarget.dataset.url;
    const title = evt.currentTarget.dataset.title;
    // dispatch(viewImage({ url: url, title: title }));
    history.push(routes.buildLabelingDetailPath(id)); //TODO: 이미지 아이디가 들어가도록 변경
  };

  return (
    <div className={styles.labelingHome}>
      <header className={styles.title}>{title}</header>
      <main className={styles.cardItemBox}>
        {sceneList.map((scene: Scene) => (
          <Card key={scene.id} id={scene.id} text={scene.title} url={scene.url} thumbnailUrl={scene.thumbnailUrl} onClick={viewScene(scene.id)} />
        ))}
      </main>
    </div>
  );
}
