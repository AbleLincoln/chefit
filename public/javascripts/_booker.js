
// Tabbing and Next buttons
const tabs = document.querySelectorAll('.tabs .tab');
const cards = document.querySelectorAll('.booker-card');
const buttons = document.querySelectorAll('.button');

tabs.forEach(tab => {
  tab.addEventListener('click', setActive);
})

buttons.forEach(button => {
  button.addEventListener('click', setActive);
})

function setActive() {
  tabs.forEach(tab => {
    if(tab.dataset.tab === this.dataset.tab) tab.classList.add('active');
    else tab.classList.remove('active');
  });
  cards.forEach(card => {
    if(card.id === this.dataset.tab) card.classList.add(('active'));
    else card.classList.remove('active');
  })
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
  const input = this.getElementsByTagName('input')[0];
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
  const error = this.parentNode.parentNode.getElementsByClassName('error')[0];
  if(parseInt(input.value) + countAmnt > input.max || parseInt(input.value) + countAmnt < input.min) {
    // TODO error message
    // console.log(`err numb too high/low ${input.value + countAmnt}`);
  } else {
    input.value = parseInt(input.value) + countAmnt;
    label.innerHTML = input.value;
    if(parseInt(input.value) >= 8) {
      error.innerHTML = 'Parties of 8 or more will be served family style';
    } else {
      error.innerHTML = '';
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
