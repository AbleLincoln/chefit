// errors for all
const errors = document.querySelector('.errors');
let errorsList = new Map();

// Tabbing and Next buttons
const tabs = document.querySelectorAll('.tabs .tab');
const cards = document.querySelectorAll('.booker-card');
var activeCard = cards[0];
const buttons = document.querySelectorAll('.button');
const backButtons = document.querySelectorAll('.button.back');

// tabs.forEach(tab => {
//   tab.addEventListener('click', setActive);
// })

buttons.forEach(button => {
  button.addEventListener('click', setActive);
});

backButtons.forEach(button => {
  button.addEventListener('click', setActiveBack);
});

function setActive() {
  animateClick(this);
  if(!validateCard(activeCard)) return;
  tabs.forEach(tab => {
    if(tab.dataset.tab === this.dataset.tab) tab.classList.add('active');
    else tab.classList.remove('active');
  });
  cards.forEach(card => {
    if(card.id === this.dataset.tab) {
      card.classList.add(('active'));
      activeCard = card;
    }
    else card.classList.remove('active');
  });
  clearErrors();
}

function setActiveBack() {
  tabs.forEach(tab => {
    if(tab.dataset.tab === this.dataset.tab) tab.classList.add('active');
    else tab.classList.remove('active');
  });
  cards.forEach(card => {
    if(card.id === this.dataset.tab) {
      card.classList.add(('active'));
      activeCard = card;
    }
    else card.classList.remove('active');
  });
  clearErrors();
}

const submitButton = document.querySelector('#submit');
submitButton.addEventListener('click', validateFinalCard);
function validateFinalCard() {
  document.querySelector('#booker').submit();
};

// validation
function validateCard(card) {
  const inputs = card.querySelectorAll('.input input');
  let invalid = false;
  inputs.forEach(input => {
    if(input.value === null || input.value === "") {
      input.classList.add('invalid');
      invalid = true;
      // input.classList.add('error');
      // addError('empty field', 'Please fill out all fields');
    } else if(!input.checkValidity()) {
      input.classList.add('invalid');
      invalid = true;
      // addError(`invalid ${input.name}`, `Please input your ${input.name} in a valid format`);
    } else {
      input.classList.remove('invalid');
      removeError(`invalid ${input.name}`);
    }
  })

  let appSelected = false;
  let saladSelected = false;
  let mainSelected = false;
  const radios = card.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    if(radio.name === "appetizer" && radio.checked) appSelected = true;
    else if(radio.name === "salad" && radio.checked) saladSelected = true;
    else if(radio.name === "main" && radio.checked) mainSelected = true;
  });
  if(radios.length === 0 || (appSelected && saladSelected && mainSelected)) {
    document.querySelector('body').classList.remove('modal-open');
  }
  else {
    invalid = true;
  }

  if(invalid) {
    return false;
  }
  else return true;
}

// Package selection
const packages = document.querySelectorAll('.package');
packages.forEach(package => {
  package.addEventListener('click', setSelection);
})

function setSelection() {
  packages.forEach(package => {
    package.classList.remove('selected');
  })
  // add checked class
  this.classList.add('selected');
  // check the radio button
  let input = this.querySelector('input[name="package"]');
  input.checked = true;
}

// checkbox selection
const checkboxes = document.querySelectorAll('.checkbox');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('click', check);
})

function check() {
  if(this.classList.contains('selected')) this.classList.remove('selected');
  else this.classList.add('selected');
}

// Number counter
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  counter.addEventListener('click', count);
})

function count() {
  // get count amount
  const countAmnt = parseInt(this.dataset.count);
  // get input (there should only be one)
  const input = this.parentNode.getElementsByTagName('input')[0];
  // get number label
  const label = this.parentNode.getElementsByClassName('number')[0];
  // get error element
  // const error = this.parentNode.parentNode.getElementsByClassName('error')[0];
  if(parseInt(input.value) + countAmnt > input.max || parseInt(input.value) + countAmnt < input.min) {
    if(parseInt(input.value) === 12) {
      addError('counter oob', 'Parties greater than 12 served on special request. Please email us at admin@GetChefIt.com');
    } else if(parseInt(input.value) === 4) {
      addError('counter oob', 'Currrently we do not serve parties of less than 4 people. Please email us at admin@GetChefIt.com for any special requests');
    }
  } else {
    removeError('counter oob');
    input.value = parseInt(input.value) + countAmnt;
    label.innerHTML = input.value;
    if(parseInt(input.value) >= 8) {
      // errors.classList.remove('inactive');
      // errors.innerHTML = '<p>Parties of 8 or more will be served family style</p>';
      addError('counter above 8', 'Parties of 8 or more will be served family style');
    } else {
      // errors.classList.add('inactive');
      // errors.innerHTML = '';
      removeError('counter above 8');
    }
    animateClick(this);
  }
}

// animate counters
function animateClick(button) {
  button.classList.add('clicked');
  setTimeout(function() {
    button.classList.remove('clicked');
  }, 150);
}

// Flatpickr date/time picker
flatpickr('.dateInput input', {
  altInput: true,
  minDate: "today"
});
flatpickr('.timeInput input', {
  enableTime: true,
  noCalendar: true,
  altInput: true,
  defaultHour: 18,
  defaultDate: "18:00"
});

// errors
function addError(errorName, errorMessage) {
  errorsList.set(errorName, `<p>${errorMessage}</p>`);
  displayErrors();
}

function removeError(errorName) {
  errorsList.delete(errorName);
  displayErrors();
}

function clearErrors() {
  errorsList.clear();
  displayErrors();
}

function displayErrors() {
  let errorMessages = '';
  errorsList.forEach((value, key) => {
    errorMessages += value;
  })
  // const errorsMessage = errorsList.join();
  errors.innerHTML = errorMessages;
  if(errorMessages === '') errors.classList.add('inactive');
  else errors.classList.remove('inactive');
}

// Google Maps api
const addressInput = document.querySelector('#address');
var autocompleteAddressInput = new google.maps.places.Autocomplete(addressInput, {});

// modals
const modals = document.querySelectorAll('.modal');
const menuButtons = document.querySelectorAll('.menu');

menuButtons.forEach(button => {
  button.addEventListener('click', openModal);
});

function openModal() {
  document.querySelector(`#${this.dataset.modal}`).classList.add('open');
  document.querySelector('body').classList.add('modal-open');
}

modals.forEach(modal => {
  modal.addEventListener('click', closeModal);
})

function closeModal(e) {
  // if(e.target !== this) return; // if we click the actual content, don't close
  if(e.target === this || e.target === this.querySelector('.button--clear')) {
    this.classList.remove('open');
    document.querySelector('body').classList.remove('modal-open');
  }
}

const modalButtons = document.querySelectorAll('.modal .button');

modalButtons.forEach(button => {
  button.addEventListener('click', validateMenu);
});

function validateMenu() {
  let appSelected = false;
  let saladSelected = false;
  let mainSelected = false;
  const radios = activeCard.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    if(radio.name === "appetizer" && radio.checked) appSelected = true;
    else if(radio.name === "salad" && radio.checked) saladSelected = true;
    else if(radio.name === "main" && radio.checked) mainSelected = true;
  });
  activeCard.querySelector('.modal .menu-errors').innerHTML = "";
  if(!appSelected) {
    activeCard.querySelector('.modal .menu-errors').innerHTML += '<p>Please select an appetizer</p>';
  }
  if(!saladSelected) {
    activeCard.querySelector('.modal .menu-errors').innerHTML += '<p>Please select a salad</p>';
  }
  if(!mainSelected) {
    activeCard.querySelector('.modal .menu-errors').innerHTML += '<p>Please select a main course</p>';
  }
}
