
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
