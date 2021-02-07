import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { LabelMode, selectLabels } from "../../../../common/modules/annotator";
import { RootState } from "../../../../index";

import cn from "classnames";
import styles from "./LabelListBox.module.scss";
import { Left } from "../../../../common/asset/icons";

const compareIds = (_ids: Array<number>) => {
  const ids = [] as Array<number>;
  document.querySelectorAll(".label-info.active").forEach((labelInfo: Element) => {
    const info: HTMLLIElement = labelInfo as HTMLLIElement;
    ids.push(Number(info.dataset.id));
  });
  if (ids.length !== _ids.length) {
    return false;
  }
  for (let i = 0; i < _ids.length; i++) {
    if (Number(_ids[i]) !== Number(ids[i])) {
      return false;
    }
  }
  return true;
};

interface Label {
  id: number;
  name: string;
  coordinates: Array<{ x: number; y: number }>;
  data: { x: number; y: number; w: number; h: number; deg: number };
}

type Props = {
  className?: string;
};

export default function LabelListBox(props: Props) {
  const refLabelList = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.annotatorReducer.mode);
  const selectedLabelsIds = useSelector((state: RootState) => state.annotatorReducer.selectedLabelsIds);
  const labels = useSelector((state: RootState) =>
    state.annotatorReducer.labels[state.annotatorReducer.currentImgURL] === undefined
      ? []
      : state.annotatorReducer.labels[state.annotatorReducer.currentImgURL],
  );

  useEffect(() => {
    console.log("LabelList useEffect [props.labels]");
    if (!refLabelList.current) {
      return;
    }
    const curRefLabelList = refLabelList.current;
    const labelListRoot = curRefLabelList.lastChild as HTMLUListElement;
    while (labelListRoot.firstChild) {
      labelListRoot.removeChild(labelListRoot.firstChild);
    }
    let labelList = "";
    labels.forEach((label: Label) => {
      labelList += `
                <li class="label-info btn" data-id="${label.id}" data-testid="testLabelInfo">
                    <p class="label-class">${label.name}</p>
                    <p class="label-coordinate">
                        (${Number(label.coordinates[0].x)}, ${Number(label.coordinates[0].y)})
                        (${Number(label.coordinates[1].x)}, ${Number(label.coordinates[1].y)})
                        (${Number(label.coordinates[2].x)}, ${Number(label.coordinates[2].y)})
                        (${Number(label.coordinates[3].x)}, ${Number(label.coordinates[3].y)})
                    </p>
                </li>
            `;
    });

    labelListRoot.insertAdjacentHTML("afterbegin", labelList);
  }, [labels]);

  useEffect(() => {
    console.log("LabelList useEffect [props.selectedLabelsIds]");
    if (compareIds(selectedLabelsIds)) {
      console.log("LabelList useEffect [props.selectedLabelsIds] returned");
      return;
    }
    document.querySelectorAll(".label-info").forEach((labelInfo) => {
      const info: HTMLElement = labelInfo as HTMLElement;
      info.classList.remove("active");
      selectedLabelsIds.forEach((id) => {
        if (Number(info.dataset.id) === Number(id)) {
          info.classList.add("active");
        }
      });
    });
  }, [selectedLabelsIds]);

  const toggleLabelList = () => {
    const controller = document.querySelector(".label-list-controller") as HTMLDivElement;
    const img = document.querySelector(".label-list-btn-img") as HTMLImageElement;
    const labelListRoot = document.querySelector(".label-list-root") as HTMLUListElement;
    if (labelListRoot.style.display === "block") {
      (controller.firstChild as HTMLElement).style.display = "none";
      controller.style.minWidth = "38px";
      controller.style.borderRight = "1px solid lightgray";
      // img.src = imgArrowRight;
      labelListRoot.style.display = "none";
      (labelListRoot.parentNode as HTMLElement).style.borderRight = "none";
    } else {
      (controller.firstChild as HTMLElement).style.display = "block";
      controller.style.minWidth = "300px";
      controller.style.borderRight = "none";
      // img.src = imgArrowLeft;
      labelListRoot.style.display = "block";
      (labelListRoot.parentNode as HTMLElement).style.borderRight = "1px solid lightgray";
    }
  };

  const selectLabel = (evt: any): void => {
    if (mode === LabelMode.Create) {
      return;
    }
    const labelInfo: HTMLLIElement = evt.target.classList.contains("label-info") ? evt.target : evt.target.parentNode;
    labelInfo.classList.add("active");
    if (!evt.ctrlKey) {
      document.querySelectorAll(".label-info.active").forEach((info: Element) => {
        if (labelInfo !== info) {
          info.classList.remove("active");
        }
      });
    }
    const ids = [] as Array<number>;
    document.querySelectorAll(".label-info.active").forEach((info: Element) => {
      ids.push(Number((info as HTMLLIElement).dataset.id as string));
    });
    dispatch(selectLabels({ selectedLabelsIds: ids }));
  };

  return (
    <aside className={cn(styles.labelListBox, props.className)} ref={refLabelList}>
      <div className={styles.labelListController}>
        <span>Labels</span>
        <button className={styles.labelListBtn} onClick={toggleLabelList} type="button">
          <Left />
        </button>
      </div>
      <ul className={styles.labelListRoot} style={{ display: "block" }} onMouseDown={selectLabel} />
    </aside>
  );
}
