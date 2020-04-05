import React, {useEffect} from 'react';

export default function CardList(props) {
    
    
    useEffect(() => {
        console.log('CardList useEffect');

        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(json => {
                const cardList = document.querySelector('.card-list');
                let cards = '';
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


    const viewImg = e => {
        if(e.target.className === 'thumbnail') {
            props.viewImage(e.target.dataset.url, e.target.dataset.title);
        }
    };


    return (
        <div>
            <div className="card-list" onClick={viewImg} data-testid="testCardList">
            </div>
        </div>
    );
}