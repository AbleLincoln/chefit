// Google Maps api
const addressInput = document.querySelector('#address');
var autocompleteAddressInput = new google.maps.places.Autocomplete(addressInput, {});
autocompleteAddressInput.addListener('place_changed', fillInZip);

const zipInput = document.querySelector('#zip');
function fillInZip() {
  var zip = autocompleteAddressInput.getPlace().address_components[7].long_name;
  zipInput.value = zip;
}