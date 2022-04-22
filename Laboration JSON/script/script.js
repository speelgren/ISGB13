/*
 * https://pokeapi.co/api/v2/pokemon/
 * https://coolors.co/palette/e63946-f1faee-a8dadc-457b9d-1d3557
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

      felmeddelande(query);
    }

    else {

      return response.json();
    }
  }).then(function(data) {

      //Image card
      let card = document.createElement('div');
      card.style.width = '25rem';
      card.style.height = '32rem';
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
      let cardTitleNode = document.createTextNode(data.name.toUpperCase()  + ' (' + data.id + ')');
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
      infoCardBody.style.height = '30rem';
      infoCard.appendChild(infoCardBody);

      let infoCardTitle = document.createElement('h1');
      infoCardTitle.classList.add('card-title');
      infoCardTitle.style.textAlign = 'center';
      infoCardBody.appendChild(infoCardTitle);
      let infoCardTitleNode = document.createTextNode('Pokédex Data');
      infoCardTitle.appendChild(infoCardTitleNode);

      let lineBreak = document.createElement('hr');
      infoCardTitle.appendChild(lineBreak);

      let i = Math.floor(Math.random() * data.moves.length);
      let j = Math.floor(Math.random() * data.moves.length);
      let favMove = data.moves[i].move.name;
      let leastFavMove = data.moves[j].move.name;

      let infoCardPre = document.createElement('pre');
      infoCardPre.classList.add('card-text');
      infoCardPre.style.margin = '0';
      let infoCardTextNode = document.createTextNode(
        'type: ' + data.types[0].type.name + '\n' +
        'height: ' + data.height * 10 + 'cm' + '\n' +
        'weight: ' + data.weight / 10 + 'kg' + '\n\n' +
        'favourite move: ' + favMove + '\n' +
        'least favourite move: ' + leastFavMove +
        '\n\n' +
        'can be found in: '
        );
      infoCardPre.appendChild(infoCardTextNode);

      let infoCardParagraph = document.createElement('p');
      infoCardParagraph.appendChild(infoCardPre);
      infoCardBody.appendChild(infoCardParagraph);

      let gameTable = document.createElement('table');
      let gameList1 = document.createElement('tr');
      let gameList2 = document.createElement('tr');

      for(let i = 0; i <= 9; i++) {

        let gameList1td = document.createElement('td');
        let gameList1tdNode = document.createTextNode(data.game_indices[i].version.name.replace('-', ' '));
        gameList1td.appendChild(gameList1tdNode);
        gameList1.appendChild(gameList1td);
        gameTable.appendChild(gameList1);
        infoCardParagraph.appendChild(gameTable);
      }

      for(let i = 10; i < data.game_indices.length; i++) {

        let gameList2td = document.createElement('td');
        let gameList2tdNode = document.createTextNode(data.game_indices[i].version.name.replace('-', ' '));

        gameList2td.appendChild(gameList2tdNode);
        gameList2.appendChild(gameList2td);
        gameTable.appendChild(gameList2);
        infoCardPre.appendChild(gameTable);
      }
  }).catch((error) => {

    console.log(error);
  });
}

function felmeddelande(query) {

  let felCard = document.createElement('div');
  felCard.style.width = '25rem';
  felCard.style.height = '35rem';
  felCard.classList.add('card');
  content.appendChild(felCard);

  let felCardImage = document.createElement('img');
  felCardImage.classList.add('card-image-top');
  felCardImage.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png';
  felCardImage.style.backgroundColor = '#A8DADC';
  felCard.appendChild(felCardImage);

  let felCardBody = document.createElement('div');
  felCardBody.classList.add('card-body');
  felCardBody.style.backgroundColor = '#A8DADC';
  felCard.appendChild(felCardBody);

  let felCardTitle = document.createElement('h5');
  felCardTitle.classList.add('card-title');
  let felCardTitleNode = document.createTextNode(`wooops! "${query}"` + ' finns ej i databasen: vänligen sök igen.');
  felCardTitle.style.textAlign = 'center';
  felCardTitle.appendChild(felCardTitleNode);
  felCardBody.appendChild(felCardTitle);

  document.querySelector('.card')[1].classList.add('d-none');
}
