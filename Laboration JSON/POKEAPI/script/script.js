'use strict';

window.addEventListener('load', () => {

  let spinner = document.querySelector('#spinner');
  let fetchContent = document.querySelector('#fetchContent');
  let content = document.querySelector('#content');
  fetchAllPokemons(fetchContent);

  /* EventListener */
  document.querySelector('#form').addEventListener('submit', (event) => {

    event.preventDefault();
    let searchValue = document.querySelector('#search').value;
    content.innerHTML = null;

    /* .toLowerCase() eftersom API:et behöver att sökningen är i gemener
   * för att sökningen ska fungera korrekt. */
   searchPokemon(fetchContent, content, searchValue.toLowerCase());
  });

  document.querySelector('.btn').addEventListener('click', () => {

    hideAndClear(fetchContent, content);
  });

  /* Timer för att inte visa information medans content laddar */
  let timeOut = setTimeout( () => {

    spinner.classList.add('d-none');
    fetchContent.classList.remove('d-none');
    fetchContent.classList.add('d-flex', 'flex-wrap', 'justify-content-center');
  }, 1500);
});

const fetchAllPokemons = (fetchContent) => {

  /* Med lite inspiration ang. hur jag kan lösa Promise.all från:
   * https://codepen.io/jamesqquick/pen/NWKaNQz */

  /* .push() används för att lägga till fetch-anropet-
   * och then-funktionen (+ response.json();), i slutet
   * av allPromises-vektorn. Promise.all(allPromises)
   * för att begära promise-objekt för alla anrop till API:et */
  let allPromises = [];
  for(let i = 1; i <= 898; i++) {

    allPromises.push(fetch('https://pokeapi.co/api/v2/pokemon/' + i)
  .then( (response) => {

    return response.json();
  }))
  Promise.all(allPromises)
  .then( (data) => {

    /* All data sparas i en vektor, från 1 till 151.
     * Använder .pop(); för att hämta ut det sita resultatet
     * i data (vektorn med alla 898-index)
     * och sparar det i variabeln pokeData.
     * Får på så sätt tillgång till alla pokemons
     * och kan presentera dem i ett slags "kollage". */
    let pokeData = data.pop();

    let cardCollage = document.createElement('figure');
    cardCollage.classList.add('card', 'cardCollage');
    cardCollage.style.width = '10rem';
    cardCollage.style.height = '13rem';
    cardCollage.style.borderRadius = '5px';
    cardCollage.style.backgroundColor = '#FFFFFC';

    fetchContent.appendChild(cardCollage);

    let cardCollageImage = document.createElement('img');
    cardCollageImage.src = pokeData.sprites.front_default;
    cardCollageImage.alt = pokeData.species.name;
    cardCollageImage.loading = 'lazy';
    cardCollage.appendChild(cardCollageImage);

    let cardCollageBody = document.createElement('figcaption');
    cardCollageBody.classList.add('card-body');
    cardCollage.appendChild(cardCollageBody);

    let cardCollageTitle = document.createElement('h6');
    cardCollageTitle.classList.add('card-title');
    cardCollageTitle.style.fontSize = '0.75rem';
    cardCollageTitle.style.textAlign = 'center';
    let cardCollageTitleNode = document.createTextNode(pokeData.name.toUpperCase() + ' #' + pokeData.id);
    cardCollageTitle.appendChild(cardCollageTitleNode);
    cardCollageBody.appendChild(cardCollageTitle);

    /* EventListener vid mouseover, "hover", över en pokemon
     * för att ändra bakgrundfärg och bilden till shiny-versionen. */
    cardCollage.addEventListener('mouseover', () => {

      if(pokeData.sprites.front_shiny !== null) {

        cardCollageImage.src = pokeData.sprites.front_shiny;
        cardCollage.style.backgroundColor = '#A8DADC';
      }
    });

    /* EventListener för att ändra tillbaka till original-
     * bakgrundfärg och bild när användaren tar bort musen från bilden. */
    cardCollage.addEventListener('mouseout', () => {

      if(cardCollageImage.src == pokeData.sprites.front_shiny) {

        cardCollageImage.src = pokeData.sprites.front_default;
        cardCollage.style.backgroundColor = '#F8F9FA';
      }
    });

    cardCollageImage.addEventListener('click', (event) => {

      /* När användaren klickar på en pokemon-bild så ska
       * allt på sidan döljas för att få fram searchPokemon()-resultatet,
       * dvs. mer specifik information om den pokemon
       * användaren har klickat på.
       * searchPokemon skickar alt-attributet från klick-eventet som parameter */
      fetchContent.className = 'd-none';
      searchPokemon(fetchContent, content, event.target.getAttribute('alt'));
    });
  }).catch( (error) => {

      console.log(error);
    })
  }
}

const searchPokemon = (fetchContent, content, query) => {

  /* .replace(' ', '-') på query används för att
   * t.ex. en sökning på "tapu lele" ska omvandlas
   * till "tapu-lele", så att sökningen går igenom. */
  window.fetch('https://pokeapi.co/api/v2/pokemon/' + query.replace(' ', '-'))
  .then( (response) => {

    /* Om response är annat än OK (t.ex. 404)
     * skapas ett felmeddelande. */
    if(!response.ok || query == '') {

      felmeddelande(query);
    } else {

      return response.json();
    }
  })
  .then( (data) => {

    fetchContent.className = 'd-none';

    /* Skapar ett bildkort med bild på den pokemon man sökt efter,
     * med namn och id-nummer */
    let card = document.createElement('figure');
    card.classList.add('card');
    card.style.width = '25rem';

    let cardImage = document.createElement('img');
    cardImage.classList.add('card-image-top');

    /* För att få tillgång till bilden under "official-artwork.front_default"
     * behövde jag använda "['official-artwork'].front_default".
     * cardImage.src kan inte ha attribut med bindestreck. */
    cardImage.src = data.sprites.other['official-artwork'].front_default;
    cardImage.alt = data.species.name;
    cardImage.style.backgroundColor = '#A8DADC';
    card.appendChild(cardImage);

    let cardBody = document.createElement('figcaption');
    cardBody.classList.add('card-body');
    cardBody.style.backgroundColor = '#A8DADC';
    card.appendChild(cardBody);

    /* Linebreak för att skilja mellan bild och text. */
    let cardImageLinebreak = document.createElement('hr');
    cardBody.appendChild(cardImageLinebreak);

    let cardTitle = document.createElement('h3');
    cardTitle.classList.add('card-title');
    let cardTitleNode = document.createTextNode(data.name.toUpperCase()  + ' #' + data.id);
    cardTitle.style.textAlign = 'center';
    cardTitle.appendChild(cardTitleNode);
    cardBody.appendChild(cardTitle);

    /* Append card till content */
    content.appendChild(card);

    /* Skapar ett infokort med information om den pokemon man sökt efter */
    let infoCard = document.createElement('section');
    infoCard.classList.add('card');
    infoCard.style.width = '25rem';
    /* Append infoCard till content */
    content.appendChild(infoCard);

    let infoCardBody = document.createElement('article');
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
    let typeNode = document.createTextNode('Type: ' + data.types[0].type.name.toUpperCase() + '\n');
    let baseXPNode = document.createTextNode('Base XP: ' + data.base_experience + '\n');
    let baseHPNode = document.createTextNode('Base HP: ' + data.stats[0].base_stat + '\n');
    let heightNode = document.createTextNode('Height: ' + data.height * 10 + 'cm' + '\n');
    let weightNode = document.createTextNode('Weight: ' + data.weight / 10 + 'kg' + '\n\n');

    infoCardPre.appendChild(typeNode);
    infoCardPre.appendChild(baseXPNode);
    infoCardPre.appendChild(baseHPNode);
    infoCardPre.appendChild(heightNode);
    infoCardPre.appendChild(weightNode);

    let infoCardParagraph = document.createElement('p');
    infoCardParagraph.appendChild(infoCardPre);
    infoCardBody.appendChild(infoCardParagraph);

    if(data.game_indices.length !== 0) {

      /* Skapar en table för att lägga in spelen karaktären kan hittas i.
       * Två for-loopar för att dela upp så att listan inte blir för lång.
       * Listan blir 10*2 */
      let infoCardFoundIn = document.createTextNode('Can be found in: ');
      infoCardPre.appendChild(infoCardFoundIn);

      let gameTable = document.createElement('table');
      let gameList = document.createElement('tr');

      /* För att dela upp i två listor */
      gameList.style = 'column-count: 2';

      data.game_indices.forEach( game => {

        let gameListTD = document.createElement('td');
        let gameListTDNode = document.createTextNode('Pokemon: ' + game.version.name.replace('-', ' ').toUpperCase());

        gameListTD.appendChild(gameListTDNode);
        gameList.appendChild(gameListTD);
        gameTable.appendChild(gameList);
      });

    infoCardPre.appendChild(gameTable);
    } else {

      let infoCardNotFoundIn = document.createTextNode(`Can't be found in-game.`);
      infoCardPre.appendChild(infoCardNotFoundIn);
    }
  }).catch( (error) => {

    console.log(error);
  });
}

const hideAndClear = (fetchContent, content) => {

  /* Det nedan används för att dölja och sedan visa alla pokemons.
   * Detta för att inte fetcha alla pokemons varje gång
   * användaren klickar in på en specifik pokemon. */
  fetchContent.classList.remove('d-none');
  fetchContent.classList.add('my-4', 'd-flex', 'flex-wrap', 'justify-content-center');
  content.innerHTML = null;
}

/* Skapar ett felmeddelande om användaren söker efter
 * en pokemon som inte finns i API:et */
const felmeddelande = (query) => {

  let felCard = document.createElement('figure');
  felCard.classList.add('card', 'bg-danger');
  felCard.style.width = '25rem';
  content.appendChild(felCard);

  let felCardImage = document.createElement('img');
  felCardImage.classList.add('card-image-top');
  felCardImage.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png';
  felCardImage.alt = 'ditto';
  felCard.appendChild(felCardImage);

  let felCardBody = document.createElement('figcaption');
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
