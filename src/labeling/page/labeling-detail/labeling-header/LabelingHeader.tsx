import React from "react";
import { useHistory } from "react-router-dom";

import * as routes from "../../../../routes";
import Button from "../../../../common/components/button/Button";

import styles from "./LabelingHeader.module.scss";
import { Home, ArrowLeft, ArrowRight } from "../../../../common/asset/icons";

export default function LabelingHeader() {
  const history = useHistory();
  // const imgTitle = useSelector((state: RootState) =>
  //   state.annotatorReducer.images[state.annotatorReducer.currentImgURL] === undefined
  //     ? ""
  //     : state.annotatorReducer.images[state.annotatorReducer.currentImgURL].title,
  // );
  const imgTitle = "adflakjwflajwelfklawklgjwgj";

  return (
    <div className={styles.labelingHeader}>
      <Button className={"home-btn"} type={"ghost"} onClick={() => history.push(routes.labeling)}>
        <Home />
      </Button>
      <section className={styles.sectionHistory}>
        <Button className={styles.historyBtn}>
          <ArrowLeft />
        </Button>
        <Button className={styles.historyBtn}>
          <ArrowRight />
        </Button>
      </section>
      <section className={styles.sectionTitle} title={imgTitle}>
        {imgTitle}
      </section>
    </div>
  );
}
