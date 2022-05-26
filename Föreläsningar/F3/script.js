/* XML */

'use strict';

window.addEventListener('load', ()=> {

  window.fetch('https://cors-anywhere.herokuapp.com/https://www3.kau.se/tentamenslista/rss.xml')
  .then(response => response.text())
  .then((handleData))
});

function handleData(xmlString) {

  //console.log(xmlString);
  let parser = new window.DOMParser();
  let xmlDOM = parser.parseFromString(xmlString, 'application/xml');

  let ul = document.createElement('ul');
  ul.classList.add('list-group');
  document.querySelector('main').appendChild(ul);

  let items = xmlDOM.querySelectorAll('item');

  items.forEach(item=> {
    let title = item.querySelector('title').textContent;
    let description = item.querySelector('description').textContent;

    let li = document.createElement('li');
    li.classList.add('list-group-item');

    let titleNode = document.createElement('h5');
    titleNode.textContent = title;

    li.appendChild(titleNode);

    let p = document.createElement('p');
    p.innerHTML = description;

    li.appendChild(p);
    ul.appendChild(li);
  });
}
