import React, {useEffect} from 'react';

export default function CardList(props) {
    
    
    useEffect(() => {
        console.log('CardList useEffect');

        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(json => {
                const cardList = document.querySelector('.card-list');

                for(let i = 0; i < 8; i++) {
                    cardList.innerHTML += `
                        <div class="card">
                            <div class="card-thumbnail">
                                <img class="thumbnail" src="${json[i].thumbnailUrl}" data-url="${json[i].url}" data-title="${json[i].title}">
                            </div>
                            <div class="card-title" title="${json[i].title}">${json[i].title}</div>
                        </div>
                    `;
                }
            })
            .catch(error => alert('fetch failed\nerror: ' + error));
    },[]);


    const viewImg = e => {
        if(e.target.classList.value === 'thumbnail') {
            props.viewImage(e.target.dataset.url, e.target.dataset.title);
        }
    };


    return (
        <div>
            <div className="card-list" onClick={viewImg}>
            </div>
        </div>
    );
}