/* Countries
 * https://restcountries.com
 *
 * https://restcountries.com/v3.1/name/sweden
 */

'use strict';

window.addEventListener('load', loadData);

function loadData() {

  //returnerar promise-objekt.
  //.then används för att hantera promise.
  window.fetch('https://restcountries.com/v3.1/name/sweden').then(function(response){

    //console.log(response);
    return response.json();
  }).then(function(data) {

    document.querySelector('#preloader').classList.add('d-none');

    let main = document.querySelector('#contant');
    let countryData = data[0];

    let card = document.createElement('div');
    card.classList.add('card');
    card.style.maxWidth = '20rem';
    main.appendChild(card);

    let cardImage = document.createElement('img');
    cardImage.classList.add('card-image-top');
    cardImage.src = countryData.flags.png;
    card.appendChild(cardImage);

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);

    let cardTitle = document.createElement('header');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = countryData.name.official;
    cardBody.appendChild(cardTitle);

    let capital = document.createElement('p');
    capital.classList.add('card-text');
    capital.textContent = countryData.capital;
    cardBody.appendChild(capital);

    let area = document.createElement('p');
    area.classList.add('card-text');
    area.innerHTML = countryData.area + ' km<sup>2</sup>';
    cardBody.appendChild(area);

    let population = document.createElement('p');
    population.classList.add('card-text');
    population.textContent = countryData.population + " st";
    cardBody.appendChild(population);
  });
}
