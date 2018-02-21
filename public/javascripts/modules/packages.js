// Package selection
const packages = document.querySelectorAll('.package');
packages.forEach(aPackage => {
  aPackage.addEventListener('click', setSelection);
})

function setSelection(e) {
  packages.forEach(aPackage => {
    aPackage.classList.remove('selected');
  })
  // add checked class
  this.classList.add('selected');
  // check the radio button
  let input = this.querySelector('input[name="package"]');
  input.checked = true;

  //open modal
  if(e.target === this.querySelector('.modal') || e.target === this.querySelector('.button--clear')) {
    // allow us to close the modal
  } else {
    this.querySelector('.modal').classList.add('open');
    document.querySelector('body').classList.add('modal-open');
  }
}