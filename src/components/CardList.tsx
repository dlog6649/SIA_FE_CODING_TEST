import React, { useEffect, useRef } from 'react';

const url: string = 'https://jsonplaceholder.typicode.com/photos';
const proxyurl: string = "https://cors-anywhere.herokuapp.com/";

interface Props {
    viewImage: any
}

export default function CardList(props: Props) {
    let refCardList = useRef(null);
    useEffect(() => {
        console.log('CardList useEffect');
        fetch(proxyurl + url)
            .then((response) => response.json())
            .then((json) => {
                const cardList: any = refCardList.current;
                let cards: string = '';
                for(let i = 0; i < 8; i++) {
                    cards += `
                        <div class="card">
                            <div class="card-thumbnail">
                                <img class="thumbnail" data-testid="testThumbnail" src="${json[i].thumbnailUrl}" data-url="${json[i].url}" data-title="${json[i].title}">
                            </div>
                            <div class="card-title" title="${json[i].title}">${json[i].title}</div>
                        </div>
                    `;
                }
                cardList.insertAdjacentHTML('afterbegin', cards);
            })
            .catch(error => alert('fetch failed\nerror: ' + error));
    },[]);

    const viewImg = (e: any) => {
        if(e.target.className === 'thumbnail') {
            props.viewImage(e.target.dataset.url, e.target.dataset.title);
        }
    };

    return (
        <div>
            <div className="card-list" onClick={viewImg} data-testid="testCardList" ref={refCardList} >
            </div>
        </div>
    );
}