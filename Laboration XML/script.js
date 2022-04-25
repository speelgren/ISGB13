'use strict';

window.addEventListener('load', init);

function init() {

  document.querySelector('#form').addEventListener('submit', searchValue);
}

function searchValue(e) {

  e.preventDefault();
  let searchValue = document.querySelector('#search').value;
  search(searchValue.toLowerCase());
}

/* Ska skrivas om till XML. */

function search(query) {

  let apikey = '?apikey=ecb78f37&';

  window.fetch('http://www.omdbapi.com/' + apikey + 't=' + query)
  .then(function(response) {

    return response.json();
  }).then(function(data) {

    let h1 = document.createElement('h1');
    let title = document.createTextNode(data.Title);
    let p = document.createElement('p');
    let actor = document.createTextNode(data.Actors);
    p.appendChild(actor);
    h1.appendChild(title);

    document.querySelector('#content').appendChild(h1);
    document.querySelector('#content').appendChild(p);
  })
}
