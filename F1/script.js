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

    //console.log(data);
    let countryName = data[0].name.official;
    //console.log(countryName);

  });
}
