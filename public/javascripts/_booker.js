
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
