function animateClick(button) {
  button.classList.add('clicked');
  setTimeout(function() {
    button.classList.remove('clicked');
  }, 150);
}

export default animateClick;