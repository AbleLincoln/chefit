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
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    if(radio.name === "appetizer" && radio.checked) appSelected = true;
    else if(radio.name === "salad" && radio.checked) saladSelected = true;
    else if(radio.name === "main" && radio.checked) mainSelected = true;
  });
  this.parentElement.querySelector('.menu-errors').innerHTML = "";
  if(!appSelected) {
    this.parentElement.querySelector('.menu-errors').innerHTML += '<p>Please select an appetizer</p>';
  }
  if(!saladSelected) {
    this.parentElement.querySelector('.menu-errors').innerHTML += '<p>Please select a salad</p>';
  }
  if(!mainSelected) {
    this.parentElement.querySelector('.menu-errors').innerHTML += '<p>Please select a main course</p>';
  }
}