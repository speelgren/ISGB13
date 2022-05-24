'use strict';

window.addEventListener('DOMContentLoaded', () => {

  let form = document.querySelector('#form');
  let button = document.querySelector('#button');
  let spinner = document.querySelector('#spinner');
  let fetchContent = document.querySelector('#fetchContent');
  let content = document.querySelector('#content');
  fetchAllPokemons(fetchContent);

  /* EventListener för submit / searchPokemon-funktion. */
  form.addEventListener('submit', event => {

    event.preventDefault();
    let searchValue = document.querySelector('#search').value;
    content.innerHTML = null;

    /* .toLowerCase() eftersom API:et behöver att sökningen är i gemener
     * för att sökningen ska fungera korrekt. */
    searchPokemon(spinner, fetchContent, content, searchValue.toLowerCase());
  });

  /* EventListener för click / hideAndClear-funktion. */
  button.addEventListener('click', () => {

    fetchContent.classList.remove('d-none');
    fetchContent.classList.add('my-4', 'd-flex', 'flex-wrap', 'justify-content-center');
    content.innerHTML = null;
  });

  /* Timer medan fetchContent laddar. */
  const fetchContentTO = setTimeout( () => {

    /* Döljer spinner och visar fetchContent */
    spinner.classList.add('d-none');
    fetchContent.classList.remove('d-none');
    fetchContent.classList.add('my-4', 'd-flex', 'flex-wrap', 'justify-content-center');
  }, 1500);
});

const fetchAllPokemons = fetchContent => {

  let allPromises = [];
  for (let pokeID = 1; pokeID <= 493; pokeID++) {

    allPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}`)
    .then( response => { return response.json(); } )
    )
    Promise.all(allPromises)
    .then( data => {

      /* All data sparas i en vektor.
       * Använder .pop() för att hämta sista index i vektorn */
      let pokeData = data.pop();

      let cardFigure = document.createElement('figure');
      cardFigure.classList.add('card');
      cardFigure.style.width = '10rem';
      cardFigure.style.height = '13.5rem';
      cardFigure.style.borderRadius = '5px';
      cardFigure.style.backgroundColor = '#FFFFFC';

      fetchContent.appendChild(cardFigure);

      let cardFigureImage = document.createElement('img');
      cardFigureImage.src = pokeData.sprites.front_default;
      cardFigureImage.alt = pokeData.name;
      cardFigureImage.style.width = '158px';
      cardFigureImage.style.height = '158px';
      cardFigureImage.loading = 'lazy';
      cardFigure.appendChild(cardFigureImage);

      let cardFigureBody = document.createElement('figcaption');
      cardFigureBody.classList.add('card-body');
      cardFigureBody.style.paddingBottom = '0';
      cardFigure.appendChild(cardFigureBody);

      let cardFigureTitle = document.createElement('h6');
      cardFigureTitle.classList.add('card-title');
      cardFigureTitle.style.fontSize = '0.85rem';
      cardFigureTitle.style.textAlign = 'center';
      let cardFigureTitleNode = document.createTextNode(`${pokeData.name.toUpperCase()} #${pokeData.id}`);
      cardFigureTitle.appendChild(cardFigureTitleNode);
      cardFigureBody.appendChild(cardFigureTitle);

      /* EventListener för mouseover-metod */
      /* Ändrar bild och bakgrundsfärg på kort */
      cardFigure.addEventListener('mouseover', () => {

          cardFigureImage.src = pokeData.sprites.front_shiny;
          cardFigure.style.backgroundColor = '#EF476F';
          cardFigureTitle.style.color = '#FFFFFC';
      });

      /* EventListener för mouseover-metod */
      /* Ändrar bild och bakgrundsfärg på kort */      cardFigure.addEventListener('mouseout', () => {

          cardFigureImage.src = pokeData.sprites.front_default;
          cardFigure.style.backgroundColor = '#FFFFFC';
          cardFigureTitle.style.color = '#073B4C';
      });

      /* EventListener för klick på en Pokémon i kollaget */
      cardFigureImage.addEventListener('click', event => {

        spinner.classList.add('spinner-border', 'text-danger');
        fetchContent.className = 'd-none';
        searchPokemon(spinner, fetchContent, content, event.target.getAttribute('alt'));
      });
    }).catch( error => { console.log( error ); } );
  }
};

const searchPokemon = (spinner, fetchContent, content, query) => {

  let q = query.replace(' ', '-');
  window.fetch(`https://pokeapi.co/api/v2/pokemon/${q}`)
  .then( response => {

    /* Om response är annat än OK (t.ex. 404)
     * skapas ett felmeddelande. */
    if (!response.ok || query == '') {

      felmeddelande(spinner, query, content);
    } else {

      return response.json();
    }
  })
  .then( data => {

    /* För att tömma sökrutan efter sökning */
    document.querySelector('#search').value = null;
    spinner.className = 'spinner-border text-danger';
    fetchContent.className = 'd-none';

    /* Skapar ett bildkort med bild på den pokemon man sökt efter,
     * med namn och id-nummer */
    let card = document.createElement('figure');
    card.classList.add('card');
    card.style.width = '25rem';

    let cardImage = document.createElement('img');
    cardImage.classList.add('card-image-top');
    cardImage.src = data.sprites.other['official-artwork'].front_default;
    cardImage.alt = data.name;
    cardImage.style.backgroundColor = '#FFFFFC';

    card.appendChild(cardImage);

    let cardBody = document.createElement('figcaption');
    cardBody.classList.add('card-body');
    cardBody.style.backgroundColor = '#FFFFFC';
    card.appendChild(cardBody);

    /* Linebreak för att skilja mellan bild och text. */
    let cardImageLinebreak = document.createElement('hr');
    cardBody.appendChild(cardImageLinebreak);

    let cardTitle = document.createElement('h4');
    cardTitle.classList.add('card-title');
    let cardTitleNode = document.createTextNode(`${data.name.toUpperCase()} #${data.id}`);
    cardTitle.style.textAlign = 'center';
    cardTitle.appendChild(cardTitleNode);
    cardBody.appendChild(cardTitle);

    /* Skapar ett infokort med information om den pokemon man sökt efter */
    let infoCard = document.createElement('section');
    infoCard.classList.add('card');
    infoCard.style.width = '25rem';

    let infoCardBody = document.createElement('article');
    infoCardBody.classList.add('card-body');
    infoCardBody.style.backgroundColor = '#FFFFFC';
    infoCard.appendChild(infoCardBody);

    let infoCardTitle = document.createElement('h2');
    infoCardTitle.classList.add('card-title');
    infoCardTitle.style.textAlign = 'center';
    infoCardBody.appendChild(infoCardTitle);
    let infoCardTitleNode = document.createTextNode('Pokédex Data');
    infoCardTitle.appendChild(infoCardTitleNode);

    /* Linebreak för att skilja mellan infoCard's title och texten. */
    let infoCardLinebreak = document.createElement('hr');
    infoCardTitle.appendChild(infoCardLinebreak);

    let infoCardParagraph = document.createElement('p');
    let infoCardPre = document.createElement('pre');
    infoCardPre.classList.add('card-text');
    infoCardPre.style.margin = '0';

    /* Skapar textNode för alla stats.
     * append till pre för att kunna behålla radbrytningar '\n'. */
    let statsNode = document.createTextNode(
      `Type: ${data.types[0].type.name.toUpperCase()}\n`
    + `Base XP: ${data.base_experience}\n`
    + `Base HP: ${data.stats[0].base_stat}\n`
    + `Height: ${data.height * 10}cm\n`
    + `Weight: ${data.weight / 10}kg\n\n`
    );

    infoCardPre.appendChild(statsNode);
    infoCardParagraph.appendChild(infoCardPre);
    infoCardBody.appendChild(infoCardParagraph);

    if (data.game_indices.length !== 0) {

      let infoCardFoundIn = document.createTextNode('Can be found in: ');
      infoCardPre.appendChild(infoCardFoundIn);

      let gameTable = document.createElement('table');
      let gameTR = document.createElement('tr');

      /* För att dela upp i två listor */
      gameTR.style.columnCount = '2';

      /* forEach-loop för att få ut alla titelnamn */
      data.game_indices.forEach( game => {

        let gameTD = document.createElement('td');
        let gameTDNode = document.createTextNode(`Pokémon ${game.version.name.replace('-', ' ').toUpperCase()}`);

        gameTD.appendChild(gameTDNode);
        gameTR.appendChild(gameTD);
        gameTable.appendChild(gameTR);
      });

    infoCardPre.appendChild(gameTable);
    } else {

      let infoCardNotFoundIn = document.createTextNode('Cannot be found in game.');
      infoCardPre.appendChild(infoCardNotFoundIn);
    }

    /* Timer medan content laddar. */
    const contentTO = setTimeout( () => {

      /* Döljer spinner. */
      spinner.className = 'd-none';

      /* Append card till content */
      document.querySelector('#content').appendChild(card);
      /* Append infoCard till content */
      document.querySelector('#content').appendChild(infoCard);
    }, 500);
  }).catch( error => { console.log( error ); } );
};

/* Skapar ett felmeddelande om användaren söker efter
 * en pokemon som inte finns i API:et
 * eller en tom sträng */
const felmeddelande = (spinner, query, content) => {

  let felCard = document.createElement('figure');
  felCard.classList.add('card', 'bg-danger');
  felCard.style.width = '25rem';

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

  if (query !== '') {

    let felCardTitleNode = document.createTextNode(`Ditto could not find "${query}" in the database. Try again!`);
    felCardTitle.style.textAlign = 'center';
    felCardTitle.appendChild(felCardTitleNode);
  } else {

    let felCardTitleNode = document.createTextNode('Empty query. Try again!');
    felCardTitle.style.textAlign = 'center';
    felCardTitle.appendChild(felCardTitleNode);
  }
  felCardBody.appendChild(felCardTitle);

  /* Timer medan felmeddelande laddar. */
  const felmeddelandeTO = setTimeout( () => {

    /* Döljer spinner. */
    spinner.className = 'd-none';
    /* Append felCard till content. */
    content.appendChild(felCard);
  }, 500);
};
