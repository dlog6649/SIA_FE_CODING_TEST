import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { LABEL_CREATE_MODE } from "../modules/annotator";
import imgArrowRight from "../asset/images/arrow-right.png";
import imgArrowLeft from "../asset/images/arrow-left.png";

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

interface Props {
  mode: string;
  labels: Array<Label>;
  selectedLabelsIds: Array<number>;
  selectLabels: (selectedLabelsIds: Array<number>) => void;
}

export default function LabelList(props: Props) {
  const refLabelList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("LabelList useEffect [props.labels]");
    let { labels } = props;
    if (!labels) {
      labels = [] as Array<Label>;
    }
    if (!refLabelList.current) {
      return;
    }
    const curRefLabelList = refLabelList.current;
    const labelListRoot = curRefLabelList.lastChild as HTMLUListElement;
    while (labelListRoot.firstChild) {
      labelListRoot.removeChild(labelListRoot.firstChild);
    }
    let labelList = "";
    labels.forEach((label) => {
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
  }, [props.labels]);

  useEffect(() => {
    console.log("LabelList useEffect [props.selectedLabelsIds]");
    if (compareIds(props.selectedLabelsIds)) {
      console.log("LabelList useEffect [props.selectedLabelsIds] returned");
      return;
    }
    document.querySelectorAll(".label-info").forEach((labelInfo) => {
      const info: HTMLElement = labelInfo as HTMLElement;
      info.classList.remove("active");
      props.selectedLabelsIds.forEach((id) => {
        if (Number(info.dataset.id) === Number(id)) {
          info.classList.add("active");
        }
      });
    });
  }, [props.selectedLabelsIds]);

  const toggleLabelList = () => {
    const controller = document.querySelector(".label-list-controller") as HTMLDivElement;
    const img = document.querySelector(".label-list-btn-img") as HTMLImageElement;
    const labelListRoot = document.querySelector(".label-list-root") as HTMLUListElement;
    if (labelListRoot.style.display === "block") {
      (controller.firstChild as HTMLElement).style.display = "none";
      controller.style.minWidth = "38px";
      controller.style.borderRight = "1px solid lightgray";
      img.src = imgArrowRight;
      labelListRoot.style.display = "none";
      (labelListRoot.parentNode as HTMLElement).style.borderRight = "none";
    } else {
      (controller.firstChild as HTMLElement).style.display = "block";
      controller.style.minWidth = "300px";
      controller.style.borderRight = "none";
      img.src = imgArrowLeft;
      labelListRoot.style.display = "block";
      (labelListRoot.parentNode as HTMLElement).style.borderRight = "1px solid lightgray";
    }
  };

  const selectLabel = (evt: any): void => {
    if (props.mode === LABEL_CREATE_MODE) {
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
    props.selectLabels(ids);
  };

  return (
    <div className="label-list" ref={refLabelList}>
      <div className="label-list-controller">
        <span>Labels</span>
        <button className="btn label-list-btn" onClick={toggleLabelList} type="button">
          <img className="label-list-btn-img" src={imgArrowLeft} alt="arrow-left" />
        </button>
      </div>
      <ul className="label-list-root" style={{ display: "block" }} onMouseDown={selectLabel} />
    </div>
  );
}
