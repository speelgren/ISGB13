/**
 * Makes a request to https://restcountries.com/v3.1/name/{query} and displays a table with the results.
 * @param {string} query The user’s search query
 * @param {HTMLElement} container The <tbody> element that the result will be printed to
 */

window.addEventListener('load', init);

function init() {

  document.querySelector('#preloader').classList.add('d-none');
  document.querySelector('#search-form').addEventListener('submit', handleSubmit);
  document.querySelector('#content').classList.add('d-flex', 'flex-wrap');

}

function handleSubmit(e) {

  e.preventDefault();
  document.querySelector('#preloader').classList.remove('d-none');
  document.querySelector('#content').innerHTML = null;
  search(document.querySelector('#search').value, document.querySelector('#content'));
}

function search(query, container) {
  // TODO: Rewrite to match the specification
  window.fetch('https://restcountries.com/v3.1/name/' + encodeURIComponent(query))
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      console.log(data);
      document.querySelector('#preloader').classList.add('d-none');

      for(let countryData of data) {

        let card = document.createElement('div');
        card.classList.add('card');
        card.style.maxWidth = '20rem';
        container.appendChild(card);

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
      }
    });
}
