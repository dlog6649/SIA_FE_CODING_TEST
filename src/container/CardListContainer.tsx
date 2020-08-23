import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewImage } from "../modules/annotator";

const url = "https://jsonplaceholder.typicode.com/photos";
const proxyurl = "https://cors-anywhere.herokuapp.com/";

export default function CardListContainer() {
  const refCardList = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("CardList useEffect");
    fetch(proxyurl + url)
      .then((response) => response.json())
      .then((json) => {
        if (!refCardList.current) {
          return;
        }
        const cardList = refCardList.current;
        let cards = "";
        for (let i = 0; i < 8; i++) {
          cards += `
            <div class="card">
              <div class="card-thumbnail">
                  <img class="thumbnail" data-testid="testThumbnail" src="${json[i].thumbnailUrl}" data-url="${json[i].url}" data-title="${json[i].title}">
              </div>
              <div class="card-title" title="${json[i].title}">${json[i].title}</div>
            </div>
          `;
        }
        cardList.insertAdjacentHTML("afterbegin", cards);
      })
      .catch((error) => alert(`fetch failed\nerror: ${error}`));
  }, []);

  const viewImg = (evt: any) => {
    if (evt.target.className !== "thumbnail") {
      return;
    }
    const url = evt.target.dataset.url;
    const title = evt.target.dataset.title;
    dispatch(viewImage({ url: url, title: title }));
    history.push("/view");
  };

  return <div className="card-list" onClick={viewImg} data-testid="testCardList" ref={refCardList} />;
}
