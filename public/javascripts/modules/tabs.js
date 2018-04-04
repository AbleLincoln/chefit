import animateClick from "./animate-click";
import validateCard from "./validate-card";
import { clearErrors } from "./errors";

// Tabbing and Next buttons
const tabs = document.querySelectorAll('.tabs .tab');
const cards = document.querySelectorAll('.booker-card');
var activeCard = cards[0];
const nextButtons = document.querySelectorAll('.button.next');
const backButtons = document.querySelectorAll('.button.back');

nextButtons.forEach(button => {
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