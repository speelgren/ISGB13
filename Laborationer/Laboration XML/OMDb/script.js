'use strict';

window.addEventListener('load', init);

function init() {

  document.querySelector('#form').addEventListener('submit', searchValue);
  document.querySelector('#content').classList.add('d-flex', 'flex-wrap', 'justify-content-center');
}

function searchValue(e) {

  e.preventDefault();
  let searchValue = document.querySelector('#search').value;
  document.querySelector('#content').innerHTML = null;
  search(searchValue.toLowerCase());
}

function search(query) {

  window.fetch('http://www.omdbapi.com/?apikey=ecb78f37&t=' + encodeURIComponent(query) + '&r=xml')
  .then(function(response) {

      return response.text();
  }).then(function(data) {

    let parser = new window.DOMParser();
    let xmlDOM = parser.parseFromString(data, 'application/xml');
    let movie = xmlDOM.querySelectorAll('movie');
    let content = document.querySelector('#content');

    let card = document.createElement('div');
    card.style.width = '30rem';
    card.style.height = '100%';
    card.classList.add('card');
    let  cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    let cardImage = document.createElement('div');
    cardImage.style.height = '100%';
    cardImage.classList.add('card-image-top');

    let movieValue = movie[0];
    let title = movieValue.getAttribute('title');
    let genre = movieValue.getAttribute('genre');
    let actors = movieValue.getAttribute('actors');
    let poster = movieValue.getAttribute('poster');
    let plot = movieValue.getAttribute('plot');
    console.log(title, genre, actors, poster, plot);

    let elementTitle = document.createElement('h1');
    let titleTextNode = document.createTextNode(title);
    elementTitle.appendChild(titleTextNode);
    cardBody.appendChild(elementTitle);
    let plotParagraph = document.createElement('p');
    let plotTextNode = document.createTextNode(plot);
    plotParagraph.appendChild(plotTextNode);
    cardBody.appendChild(plotParagraph);
    card.appendChild(cardBody);
    content.appendChild(card);

    let posterImg = document.createElement('img');
    posterImg.classList.add('img-thumbnail');
    posterImg.src = poster;
    cardImage.appendChild(posterImg);
    content.appendChild(cardImage);

    console.log(movieValue);

  }).catch(function(error) {
    console.log(error);
  })
}
