/*
 * https://pokeapi.co/api/v2/pokemon/
*/

'use strict';

window.addEventListener('load', init);

function init() {

  document.querySelector('#form').addEventListener('submit', handleSubmit)
}

function handleSubmit(e) {

  let searchValue = document.querySelector('#search').value;

  e.preventDefault();
  document.querySelector('#content').innerHTML = null;
  search(searchValue.toLowerCase(), document.querySelector('#content'));
}

function search(query, content) {

  window.fetch('https://pokeapi.co/api/v2/pokemon/' + encodeURIComponent(query)).then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data.species.name);

      let card = document.createElement('div');
      card.style.width = '20rem';
      card.style.border = '1px solid black';
      card.classList.add('card');
      content.appendChild(card);

      let cardImage = document.createElement('img');
      cardImage.classList.add('card-image-top');
      cardImage.src = data.sprites.other.home.front_default;
      cardImage.alt = data.species.name;
      card.appendChild(cardImage);

      let cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      card.appendChild(cardBody);

      let cardTitle = document.createElement('h5');
      cardTitle.classList.add('card-title');
      let cardTitleNode = document.createTextNode(data.species.name.toUpperCase());
      cardTitle.appendChild(cardTitleNode);

      //let cardParagraph = document.createElement('p');
      //cardParagraph.classList.add('card-text');
      //let cardParagraphNode = document.createTextNode(data.);

      cardBody.appendChild(cardTitle);
  });
}
