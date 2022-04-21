/*
 * https://pokeapi.co/api/v2/pokemon/
*/

'use strict';

window.addEventListener('load', init);
document.querySelector('.navbar-brand').addEventListener('click', function() {

  location.reload();
});

function init() {

  document.querySelector('#form').addEventListener('submit', handleSubmit);
  document.querySelector('#content').classList.add('d-flex', 'flex-wrap', 'justify-content-center');
}

function handleSubmit(e) {

  e.preventDefault();
  let searchValue = document.querySelector('#search').value;
  document.querySelector('#content').innerHTML = null;

  search(searchValue.toLowerCase(), document.querySelector('#content'));
}

function search(query, content) {

  window.fetch('https://pokeapi.co/api/v2/pokemon/' + encodeURIComponent(query)).then(function(response) {

    if(query == '') {

      document.querySelector('.card').classList.add('d-none');
    }

    if(!response.ok) {

      felmeddelande();
    }

    else {

      return response.json();
    }
  }).then(function(data) {

      //Image card
      let card = document.createElement('div');
      card.style.width = '25rem';
      card.classList.add('card');
      content.appendChild(card);

      let cardImage = document.createElement('img');
      cardImage.classList.add('card-image-top');
      cardImage.src = data.sprites.other['official-artwork'].front_default;
      cardImage.alt = data.species.name + ' pokemon';
      cardImage.style.backgroundColor = '#A8DADC';
      card.appendChild(cardImage);

      let cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      cardBody.style.backgroundColor = '#A8DADC';
      card.appendChild(cardBody);

      let cardTitle = document.createElement('h4');
      cardTitle.classList.add('card-title');
      let cardTitleNode = document.createTextNode(data.species.name.toUpperCase());
      cardTitle.style.textAlign = 'center';
      cardTitle.appendChild(cardTitleNode);
      cardBody.appendChild(cardTitle);

      // Information card
      let infoCard = document.createElement('div');
      infoCard.style.width = '25rem';
      infoCard.classList.add('card');
      content.appendChild(infoCard);

      let infoCardBody = document.createElement('div');
      infoCardBody.classList.add('card-body');
      infoCardBody.style.backgroundColor = '#F1FAEE';
      infoCard.appendChild(infoCardBody);

      let infoCardTitle = document.createElement('h1');
      infoCardTitle.classList.add('card-text');
      infoCardTitle.style.textAlign = 'center';
      infoCardBody.appendChild(infoCardTitle);
      let infoCardTitleNode = document.createTextNode('Information');
      infoCardTitle.appendChild(infoCardTitleNode);

      let card2TextNode = document.createTextNode(data.species.name);
  }).catch((error) => {

    console.log(error);
  });
}

function felmeddelande() {

  let felCard = document.createElement('div');
  felCard.style.width = '25rem';
  felCard.classList.add('card');
  content.appendChild(felCard);

  let felCardBody = document.createElement('div');
  felCardBody.classList.add('card-body');
  felCardBody.style.backgroundColor = '#A8DADC';
  felCard.appendChild(felCardBody);

  let felCardTitle = document.createElement('h4');
  felCardTitle.classList.add('card-title');
  let felCardTitleNode = document.createTextNode('Vänligen sök igen.');
  felCardTitle.style.textAlign = 'center';
  felCardTitle.appendChild(felCardTitleNode);
  felCardBody.appendChild(felCardTitle);

  document.querySelector('.card')[1].classList.add('d-none');
}
