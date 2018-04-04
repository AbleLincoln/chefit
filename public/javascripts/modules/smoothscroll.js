const smoothScroll = require('smoothscroll');

const smoothScrollElements = document.querySelectorAll('[data-scroll]');

function scrollTo(e) {
  e.preventDefault();  
  
  const destination = document.querySelector(this.dataset.scroll);
  console.log(destination);
  
  smoothScroll(destination);
}

smoothScrollElements.forEach(element => element.addEventListener('click', scrollTo));


