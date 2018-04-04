// checkbox selections
const checkboxes = document.querySelectorAll('.checkbox');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('click', check);
})

function check() {
  if(this.classList.contains('selected')) this.classList.remove('selected');
  else this.classList.add('selected');
}