import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./LabelingHome.module.scss";
import * as routes from "../../../routes";
import { GET_IMAGE_LIST, Image } from "../../modules/labeling/types";
import { RootState } from "../../../index";
import { AsyncStatus } from "../../../common/modules/saga-util";
import Card from "../../../common/components/card/Card";

export default function LabelingHome() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [imageList, setImageList] = useState<Image[]>([]);
  const imageListObject = useSelector((state: RootState) => state.labelingReducer.API.getImageList);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!imageListObject) return;
    const { status, payload } = imageListObject;
    switch (status) {
      case AsyncStatus.Request:
        setLoading(true);
        break;
      case AsyncStatus.Success:
        setImageList(payload.slice(0, 12));
        setLoading(false);
        break;
      case AsyncStatus.Failure:
        setImageList([]);
        setLoading(false);
        alert(payload);
        break;
    }
  }, [imageListObject]);

  useEffect(() => {
    dispatch({ type: GET_IMAGE_LIST });
  }, []);

  const linkToLabelingDetail = (id: number) => () => {
    // dispatch(viewImage({ url: url, title: title }));
    history.push(routes.buildLabelingDetailPath(id));
  };

  return (
    <main className={styles.labelingHome}>
      <h1 className={styles.title}>{"Labeling Home"}</h1>
      <div className={styles.cardItemBox}>
        {isLoading ? (
          <h2>{"Loading..."}</h2>
        ) : !imageList.length ? (
          <h2>{"No Data"}</h2>
        ) : (
          imageList.map((scene: Image) => (
            <Card thumbnailUrl={scene.thumbnailUrl} text={scene.title} onClick={linkToLabelingDetail(scene.id)} key={scene.id} />
          ))
        )}
      </div>
    </main>
  );
}
