/* ISGB13 */

/*
 * https://pokeapi.co/api/v2/pokemon/
 * https://coolors.co/palette/e63946-f1faee-a8dadc-457b9d-1d3557
*/

'use strict';

window.addEventListener('load', init);
document.querySelector('.navbar-brand', '.nav-link').addEventListener('click', function() {

  /* För att sidan ska laddas om helt och hållet
   * när man klickar på "ISGB13 API" i navbar. */
  location.reload();
});

function init() {

  fetchAllPokemons();
  document.querySelector('#form').addEventListener('submit', submitPokemon);
  document.querySelector('#content').classList.add('d-flex', 'flex-wrap', 'justify-content-center');
}

/* Början på en graf.
 * Osäker på om det kommer göras klart. */
function fetchAllPokemons() {

  /* Med lite inspiration från:
   * https://codepen.io/jamesqquick/pen/NWKaNQz */
  let allPromises = [];
  for(let i = 1; i <= 898; i++) {

    allPromises.push(fetch('https://pokeapi.co/api/v2/pokemon/' + i)
  .then(function(response) {

    return response.json();
  }))
  Promise.all(allPromises)
  .then(function(data) {

    /* Hämtar ut det sista resultatet ur data
     * och sparar det i variabeln pokeData */
    let pokeData = data.pop();
    let collageContent = document.querySelector('#fetchContent');
    collageContent.classList.add('d-flex', 'flex-wrap', 'justify-content-center')

    let cardCollage = document.createElement('div');
    cardCollage.classList.add('card', 'cardCollage');
    cardCollage.style.width = '10rem';
    cardCollage.style.height = '13rem';
    cardCollage.style.backgroundColor = '#F8F9FA';
    collageContent.appendChild(cardCollage);

    let cardCollageImage = document.createElement('img');
    cardCollageImage.src = pokeData.sprites.front_default;
    cardCollageImage.alt = pokeData.species.name;
    cardCollage.appendChild(cardCollageImage);

    let cardCollageBody = document.createElement('div');
    cardCollageBody.classList.add('card-body');
    cardCollage.appendChild(cardCollageBody);

    let cardCollageTitle = document.createElement('h5');
    cardCollageTitle.style.fontSize = '.75rem';
    cardCollageTitle.style.textAlign = 'center';
    cardCollageTitle.classList.add('card-title');
    let cardCollageTitleNode = document.createTextNode(pokeData.name.toUpperCase() + ' (' + pokeData.id + ') ');
    cardCollageTitle.appendChild(cardCollageTitleNode);
    cardCollageBody.appendChild(cardCollageTitle);

    cardCollageImage.addEventListener('click', function(event) {

      document.querySelector('#fetchContent').innerHTML = null;
      searchPokemon(event.target.getAttribute('alt'));
    })
  }).catch(function(error) {

    console.log(error);
  })
  }
}

function submitPokemon(e) {

  e.preventDefault();
  let searchValue = document.querySelector('#search').value;
  document.querySelector('#content').innerHTML = null;
  document.querySelector('#fetchContent').innerHTML = null;

  /* .toLowerCase() för att API:et behöver att sökningen är i gemener
   * för att sökningen ska fungera korrekt. */
  searchPokemon(searchValue.toLowerCase());
}

function searchPokemon(query) {

  window.fetch('https://pokeapi.co/api/v2/pokemon/' + query.replace(' ', '-'))
  .then(function(response) {

    /* .replace(' ', '-') på query används för att
     * t.ex. en sökning på "tapu lele" ska omvandlas
     * till "tapu-lele", så att sökningen går igenom. */

    /* Om sökningen är tom händer inget och .card döljs.
     * Behöver hitta varför detta kommer upp från första början. */
    if(query == '') {

      document.querySelector('.card').classList.add('d-none');
    }

    /* Om response är annat än OK (t.ex. 404) skapas ett felmeddelande. */
    if(!response.ok) {

      felmeddelande(query);
    }
    else {

      return response.json();
    }
  })
  .then(function(data) {

    document.querySelector('#fetchContent').classList.add('d-none');
    let content = document.querySelector('#content');

      /* Skapar ett bildkort med bild på den pokemon man sökt efter,
       * med namn och id-nummer */
      let card = document.createElement('div');
      card.style.width = '25rem';
      card.classList.add('card');
      content.appendChild(card);

      let cardImage = document.createElement('img');
      cardImage.classList.add('card-image-top');
      /* För att få tillgång till bilden under "official-artwork.front_default"
       * behövde jag använda "['official-artwork'].front_default".
       * cardImage.src kan inte ha attribut med bindestreck. */
      cardImage.src = data.sprites.other['official-artwork'].front_default;
      cardImage.alt = 'bild på ' + data.species.name + ' pokemon';
      cardImage.style.backgroundColor = '#A8DADC';
      card.appendChild(cardImage);

      let cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      cardBody.style.backgroundColor = '#A8DADC';
      card.appendChild(cardBody);

      /* Linebreak för att skilja mellan bild och text. */
      let cardImageLinebreak = document.createElement('hr');
      cardBody.appendChild(cardImageLinebreak);

      let cardTitle = document.createElement('h4');
      cardTitle.classList.add('card-title');
      let cardTitleNode = document.createTextNode(data.name.toUpperCase()  + ' (' + data.id + ')');
      cardTitle.style.textAlign = 'center';
      cardTitle.appendChild(cardTitleNode);
      cardBody.appendChild(cardTitle);

      /* Skapar ett infokort med information om den pokemon man sökt efter */
      let infoCard = document.createElement('div');
      infoCard.style.width = '25rem';
      infoCard.classList.add('card');
      content.appendChild(infoCard);

      let infoCardBody = document.createElement('div');
      infoCardBody.classList.add('card-body');
      infoCardBody.style.backgroundColor = '#F1FAEE';
      infoCard.appendChild(infoCardBody);

      let infoCardTitle = document.createElement('h1');
      infoCardTitle.classList.add('card-title');
      infoCardTitle.style.textAlign = 'center';
      infoCardBody.appendChild(infoCardTitle);
      let infoCardTitleNode = document.createTextNode('Pokédex Data');
      infoCardTitle.appendChild(infoCardTitleNode);

      /* Linebreak för att skilja mellan infoCard's title och texten. */
      let infoCardLinebreak = document.createElement('hr');
      infoCardTitle.appendChild(infoCardLinebreak);

      /* Skapar ett kort med information om moves */
      let movesetCard = document.createElement('div');
      movesetCard.style.width = '25rem';
      movesetCard.classList.add('card');
      content.appendChild(movesetCard);

      let movesetBody = document.createElement('div');
      movesetBody.classList.add('card-body');
      movesetBody.style.backgroundColor = '#F1FAEE';
      movesetCard.appendChild(movesetBody);

      let movesetTitle = document.createElement('div');
      movesetTitle.classList.add('card-title');
      movesetTitle.style.textAlign = 'center';
      movesetBody.appendChild(movesetTitle);
      let moveSetTitleNode = document.createTextNode('Possible moves');
      movesetTitle.appendChild(moveSetTitleNode);

      /* Linebreak för att skilja mellan moveset's title och text. */
      let movesetLinebreak = document.createElement('hr');
      movesetTitle.appendChild(movesetLinebreak);

      let moveTable = document.createElement('table');
      let moveList1 = document.createElement('tr');
      moveList1.setAttribute('id', 'moveListTR');
      let moveList2 = document.createElement('tr');
      moveList2.setAttribute('id', 'moveListTR');
      let moveList3 = document.createElement('tr');
      moveList3.setAttribute('id', 'moveListTR');

      for(let i = 0; i <= 14; i++) {

        let moveListTD1 = document.createElement('td');
        let moveListTD1Node = document.createTextNode(data.moves[i].move.name.replace('-', ' '));
        moveListTD1.appendChild(moveListTD1Node);
        moveList1.appendChild(moveListTD1);
        moveTable.appendChild(moveList1);
        movesetBody.appendChild(moveTable);
      }

      for(let i = 15; i <= 29; i++) {

        let moveListTD2 = document.createElement('td');
        let moveListTD2Node = document.createTextNode(data.moves[i].move.name.replace('-', ' '));
        moveListTD2.appendChild(moveListTD2Node);
        moveList2.appendChild(moveListTD2);
        moveTable.appendChild(moveList2);
        movesetBody.appendChild(moveTable);
      }

      for(let i = 30; i <= 44; i++) {

        let moveListTD3 = document.createElement('td');
        let moveListTD3Node = document.createTextNode(data.moves[i].move.name.replace('-', ' '));
        moveListTD3.appendChild(moveListTD3Node);
        moveList3.appendChild(moveListTD3);
        moveTable.appendChild(moveList3);
        movesetBody.appendChild(moveTable);
      }

      /* Används för att ge favMove och leastFavMove ett random index.
       * let i = Math.floor(Math.random() * data.moves.length);
       * let j = Math.floor(Math.random() * data.moves.length);
       * let favMove = data.moves[i].move.name;
       * let leastFavMove = data.moves[j].move.name;
       */

      let infoCardPre = document.createElement('pre');
      infoCardPre.classList.add('card-text');
      infoCardPre.style.margin = '0';
      let infoCardTextNode = document.createTextNode(
        'type: ' + data.types[0].type.name + '\n' +
        'height: ' + data.height * 10 + 'cm' + '\n' +
        'weight: ' + data.weight / 10 + 'kg' + '\n\n'
      );
      infoCardPre.appendChild(infoCardTextNode);

      let infoCardParagraph = document.createElement('p');
      infoCardParagraph.appendChild(infoCardPre);
      infoCardBody.appendChild(infoCardParagraph);

      if(data.game_indices.length > 1) {

        /* Skapar en table för att lägga in spelen karaktären kan hittas i.
         * Två for-loopar för att dela upp så att listan inte blir för lång.
         * Listan blir 10*2 */
        let infoCardFoundIn = document.createTextNode('can be found in: ');
        infoCardPre.appendChild(infoCardFoundIn);

        let gameTable = document.createElement('table');
        let gameList1 = document.createElement('tr');
        gameList1.setAttribute('id', 'gameList');
        let gameList2 = document.createElement('tr');
        gameList2.setAttribute('id', 'gameList');

        for(let i = 0; i <= 9; i++) {

          let gameList1td = document.createElement('td');
          let gameList1tdNode = document.createTextNode('pokemon ' + data.game_indices[i].version.name.replace('-', ' '));
          gameList1td.appendChild(gameList1tdNode);
          gameList1.appendChild(gameList1td);
          gameTable.appendChild(gameList1);
          infoCardParagraph.appendChild(gameTable);
        }

        for(let i = 10; i < data.game_indices.length; i++) {

          let gameList2td = document.createElement('td');
          let gameList2tdNode = document.createTextNode('pokemon ' + data.game_indices[i].version.name.replace('-', ' '));
          gameList2td.appendChild(gameList2tdNode);
          gameList2.appendChild(gameList2td);
          gameTable.appendChild(gameList2);
          infoCardParagraph.appendChild(gameTable);
        }
      } else {

        let infoCardNotFoundIn = document.createTextNode(`can't be found in-game.`);
        infoCardPre.appendChild(infoCardNotFoundIn);
      }
  }).catch(function(error) {

    console.log(error);
  });
}

/* Skapar ett felmeddelande om man söker efter en pokemon som inte finns i API:et */

function felmeddelande(query) {

  let felCard = document.createElement('div');
  felCard.style.width = '25rem';
  felCard.classList.add('card');
  felCard.classList.add('bg-danger');
  content.appendChild(felCard);

  let felCardImage = document.createElement('img');
  felCardImage.classList.add('card-image-top');
  felCardImage.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png';
  felCardImage.alt = 'bild på ditto pokemon';
  felCard.appendChild(felCardImage);

  let felCardBody = document.createElement('div');
  felCardBody.classList.add('card-body');
  felCard.appendChild(felCardBody);

  let felCardTitle = document.createElement('h5');
  felCardTitle.classList.add('card-title');
  let felCardTitleNode = document.createTextNode(`ditto hittade inte "${query}"` + ' i databasen. försök igen!');
  felCardTitle.style.textAlign = 'center';
  felCardTitle.appendChild(felCardTitleNode);
  felCardBody.appendChild(felCardTitle);

  /* Använder detta för att dölja ett .card
   * som kommer upp när man söker efter något som inte finns.
   * Behöver hitta varför detta kommer upp från första början. */
  document.querySelector('.card')[0].classList.add('d-none');
}
