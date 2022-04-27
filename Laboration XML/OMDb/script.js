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

  window.fetch('http://www.omdbapi.com/' + apikey + 't=' + query + '&r=xml')
  .then(function(response) {

    return response.text();
  }).then(function(data) {

    let parser = new window.DOMParser();
    let xmlDOM = parser.parseFromString(data, 'application/xml');

    let ul = document.createElement('ul');
    ul.classList.add('list-group');
    let main = document.querySelector('main');

    let li = document.createElement('li');
    li.classList.add('list-group-item');

    let titleNode = document.createElement('h5');
    let title = xmlDOM.querySelector('title');
    let titleTextNode = document.createTextNode(title);
    titleNode.appendChild(titleTextNode);
    li.appendChild(titleNode);

    let p = document.createElement('p');
    let plot = xmlDOM.querySelector('plot');
    let plotTextNode = document.createTextNode(plot);
    p.appendChild(plotTextNode);
    li.appendChild(p);
    console.log(plot);

    ul.appendChild(li);
    main.appendChild(ul);

    console.log(data);

    /*

    let h1 = document.createElement('h1');
    let title = document.createTextNode(data.Title);
    let p = document.createElement('p');
    let actor = document.createTextNode(data.Actors);
    p.appendChild(actor);
    h1.appendChild(title);

    document.querySelector('#content').appendChild(h1);
    document.querySelector('#content').appendChild(p);
    */
  })
}
