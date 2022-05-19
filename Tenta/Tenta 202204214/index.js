'use strict';

window.addEventListener('load', () => {

  console.log('dom skapad');
});

function changeTextInDivs() {

  let newTextArray = Array('Ett', 'Två', 'Tre', 'Fyra', 'Fem');
  let container = document.querySelectorAll('div div');

  for(let i = 0; i < newTextArray.length; i++) {

    let contain = container.item(i).firstChild;
    let arr = document.createTextNode(newTextArray[i]);

    if(contain === null) {

      container.item(i).appendChild(arr);
    } else {

      container.item(i).replaceChild(arr, contain);
    }
  }
}

changeTextInDivs();
