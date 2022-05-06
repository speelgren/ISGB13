'use strict';

window.addEventListener('load', init);

function init() {

  fetchAllPokemons();
  document.querySelector('.btn').addEventListener('click', hideAndClear);
  document.querySelector('#form').addEventListener('submit', submitPokemon);
}

function fetchAllPokemons() {

  /* Med lite inspiration ang. hur jag kan lösa Promise.all från:
   * https://codepen.io/jamesqquick/pen/NWKaNQz */

  /* .push() används för att lägga till fetch-anropet-
   * och then-funktionen (+ response.json();), i slutet
   * av allPromises-vektorn. Promise.all(allPromises)
   * för att begära promise-objekt för alla anrop till API:et */
  let allPromises = [];
  for(let i = 1; i <= 151; i++) {

    allPromises.push(fetch('https://pokeapi.co/api/v2/pokemon/' + i)
  .then(function(response) {

    return response.json();
  }))
  Promise.all(allPromises)
  .then(function(data) {

    /* All data sparas i en vektor, från 1 till 151.
     * Använder .pop(); för att hämta ut det sita resultatet
     * i data (vektorn med alla 151-index)
     * och sparar det i variabeln pokeData.
     * Får på så sätt tillgång till alla pokemons
     * och kan presentera dem i ett slags "kollage". */
    let pokeData = data.pop();
    let collageContent = document.querySelector('#fetchContent');
    collageContent.classList.add('d-flex', 'flex-wrap', 'justify-content-center');

    let cardCollage = document.createElement('div');
    cardCollage.classList.add('card', 'cardCollage');
    cardCollage.style.width = '10rem';
    cardCollage.style.height = '13rem';
    cardCollage.style.borderRadius = '5px';
    cardCollage.style.backgroundColor = '#F8F9FA';
    collageContent.appendChild(cardCollage);

    let cardCollageImage = document.createElement('img');
    cardCollageImage.src = pokeData.sprites.front_default;
    cardCollageImage.alt = pokeData.species.name;
    cardCollage.appendChild(cardCollageImage);

    let cardCollageBody = document.createElement('div');
    cardCollageBody.classList.add('card-body');
    cardCollage.appendChild(cardCollageBody);

    let cardCollageTitle = document.createElement('h6');
    cardCollageTitle.style.fontSize = '0.75rem';
    cardCollageTitle.style.textAlign = 'center';
    cardCollageTitle.classList.add('card-title');
    let cardCollageTitleNode = document.createTextNode(pokeData.name.toUpperCase() + ' (' + pokeData.id + ')');
    cardCollageTitle.appendChild(cardCollageTitleNode);
    cardCollageBody.appendChild(cardCollageTitle);

    /* EventListener vid mouseover, "hover", över en pokemon
     * för att ändra bakgrundfärg och bilden till shiny-versionen. */
    cardCollage.addEventListener('mouseover', function() {

      if(pokeData.sprites.front_shiny !== null) {

        cardCollageImage.src = pokeData.sprites.front_shiny;
        cardCollage.style.backgroundColor = '#A8DADC';
      }
    });

    /* EventListener för att ändra tillbaka till original-
     * bakgrundfärg och bild när användaren tar bort musen från bilden. */
    cardCollage.addEventListener('mouseout', function() {

      if(cardCollageImage.src = pokeData.sprites.front_shiny) {

        cardCollageImage.src = pokeData.sprites.front_default;
        cardCollage.style.backgroundColor = '#F8F9FA';
      }
    });

    cardCollageImage.addEventListener('click', function(event) {

      /* När användaren klickar på en pokemon-bild så ska
       * allt på sidan döljas för att få fram searchPokemon()-resultatet,
       * dvs. mer specifik information om den pokemon
       * användaren har klickat på.
       * searchPokemon skickar alt-attributet från klick-eventet som parameter */
      document.querySelector('#fetchContent').className = 'd-none';
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

  /* .toLowerCase() eftersom API:et behöver att sökningen är i gemener
   * för att sökningen ska fungera korrekt. */
  searchPokemon(searchValue.toLowerCase());
}

function searchPokemon(query) {

  /* .replace(' ', '-') på query används för att
   * t.ex. en sökning på "tapu lele" ska omvandlas
   * till "tapu-lele", så att sökningen går igenom. */
  window.fetch('https://pokeapi.co/api/v2/pokemon/' + query.replace(' ', '-'))
  .then(function(response) {

    /* Om response är annat än OK (t.ex. 404)
     * skapas ett felmeddelande. */
    if(!response.ok || query == '') {

      felmeddelande(query);
    } else {

      return response.json();
    }
  })
  .then(function(data) {

    /* Dölj h3-elementet "First Generation" */
    document.querySelector('.firstGen').classList.add('d-none');
    document.querySelector('#fetchContent').className = 'd-none';
    let content = document.querySelector('#content');

      /* Skapar ett bildkort med bild på den pokemon man sökt efter,
       * med namn och id-nummer */
      let card = document.createElement('div');
      card.style.width = '25rem';
      card.classList.add('card');
      //content.appendChild(card);

      let cardImage = document.createElement('img');
      cardImage.classList.add('card-image-top');

      /* För att få tillgång till bilden under "official-artwork.front_default"
       * behövde jag använda "['official-artwork'].front_default".
       * cardImage.src kan inte ha attribut med bindestreck. */
      cardImage.src = data.sprites.other['official-artwork'].front_default;
      cardImage.alt = data.species.name;
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

      content.appendChild(card);

      /* Skapar ett infokort med information om den pokemon man sökt efter */
      let infoCard = document.createElement('div');
      infoCard.classList.add('card');
      infoCard.style.width = '25rem';
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

      let infoCardPre = document.createElement('pre');
      infoCardPre.classList.add('card-text');
      infoCardPre.style.margin = '0';

      /* Skapar textnoder för alla stats.
       * append till pre för att kunna ha kvar radbrytningar. */
      let typeNode = document.createTextNode('type: ' + data.types[0].type.name + '\n');
      let abilityNode = document.createTextNode('ability: ' + data.abilities[0].ability.name + '\n');
      let baseXPNode = document.createTextNode('base xp: ' + data.base_experience + '\n');
      let baseHPNode = document.createTextNode('base hp: ' + data.stats[0].base_stat + '\n');
      let heightNode = document.createTextNode('height: ' + data.height * 10 + 'cm' + '\n');
      let weightNode = document.createTextNode('weight: ' + data.weight / 10 + 'kg' + '\n\n');

      infoCardPre.appendChild(typeNode);
      infoCardPre.appendChild(abilityNode);
      infoCardPre.appendChild(baseXPNode);
      infoCardPre.appendChild(baseHPNode);
      infoCardPre.appendChild(heightNode);
      infoCardPre.appendChild(weightNode);

      let infoCardParagraph = document.createElement('p');
      infoCardParagraph.appendChild(infoCardPre);
      infoCardBody.appendChild(infoCardParagraph);

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

      /* Antalet moves är helt arbitrary.
       * Har valt det som ser "bäst" ut.
       * Får TypeError om en pokemon har färre än 53 moves.
       * Återkommer. Kanske. */
      for(let i = 0; i <= 17; i++) {

        let moveListTD1 = document.createElement('td');
        let moveListTD1Node = document.createTextNode(data.moves[i].move.name.replace('-', ' '));
        moveListTD1.appendChild(moveListTD1Node);
        moveList1.appendChild(moveListTD1);
        moveTable.appendChild(moveList1);
        movesetBody.appendChild(moveTable);
      }

      for(let i = 18; i <= 35; i++) {

        let moveListTD2 = document.createElement('td');
        let moveListTD2Node = document.createTextNode(data.moves[i].move.name.replace('-', ' '));
        moveListTD2.appendChild(moveListTD2Node);
        moveList2.appendChild(moveListTD2);
        moveTable.appendChild(moveList2);
        movesetBody.appendChild(moveTable);
      }

      for(let i = 36; i <= 53; i++) {

        let moveListTD3 = document.createElement('td');
        let moveListTD3Node = document.createTextNode(data.moves[i].move.name.replace('-', ' '));
        moveListTD3.appendChild(moveListTD3Node);
        moveList3.appendChild(moveListTD3);
        moveTable.appendChild(moveList3);
        movesetBody.appendChild(moveTable);
        }

      if(data.game_indices.length !== 0) {

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

        /* Får TypeError när en pokemon varit med i färre än 9 spel..
         * Vet ej varför. Återkommer. (testat med en if-sats) */
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

function hideAndClear() {

  /* Visa h3-elementet "First Generation" */
  document.querySelector('.firstGen').classList.remove('d-none');

  /* Det nedan används för att dölja och sedan visa alla pokemons.
   * Detta för att inte fetcha alla pokemons varje gång
   * användaren klickar in på en specifik pokemon. */
   document.querySelector('#fetchContent').classList.remove('d-none');
  document.querySelector('#fetchContent').classList.add('my-4', 'd-flex', 'flex-wrap', 'justify-content-center');
  document.querySelector('#content').innerHTML = null;
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
  felCardImage.alt = 'ditto';
  felCard.appendChild(felCardImage);

  let felCardBody = document.createElement('div');
  felCardBody.classList.add('card-body');
  felCard.appendChild(felCardBody);

  let felCardTitle = document.createElement('h5');
  felCardTitle.classList.add('card-title');

  if(query !== '') {

    let felCardTitleNode = document.createTextNode(`ditto hittade inte "${query}"` + ' i databasen. försök igen!');
    felCardTitle.style.textAlign = 'center';
    felCardTitle.appendChild(felCardTitleNode);
  } else {

    let felCardTitleNode = document.createTextNode('ditto kan inte hitta en tom sökning i databasen. försök igen!');
    felCardTitle.style.textAlign = 'center';
    felCardTitle.appendChild(felCardTitleNode);
  }

  felCardBody.appendChild(felCardTitle);
}
