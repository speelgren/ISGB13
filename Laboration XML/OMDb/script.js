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

  window.fetch('http://www.omdbapi.com/?apikey=ecb78f37&t=' + query + '&r=xml')
  .then(function(response) {

    return response.text();
  }).then(function(data) {

    let parser = new window.DOMParser();
    let xmlDOM = parser.parseFromString(data, 'application/xml');
    let movie = xmlDOM.querySelectorAll('movie');

    let movieValue = movie[0];
    let title = movieValue.getAttribute('title');
    let genre = movieValue.getAttribute('genre');
    let actors = movieValue.getAttribute('actors');
    console.log(title, genre, actors);



  }).catch(function(error) {
    console.log(error);
  })
}
