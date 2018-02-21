import animateClick from "./animate-click";
import { addError, removeError } from "./errors";


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
      addError('counter oob', 'Currently we do not serve parties of less than 4 people. Please email us at admin@GetChefIt.com for any special requests');
    }
  } else {
    removeError('counter oob');
    input.value = parseInt(input.value) + countAmnt;
    label.innerHTML = input.value;
    if(parseInt(input.value) >= 9) {
      addError('counter above 9', 'Parties of 9 or more will be served family style');
    } else {
      removeError('counter above 9');
    }
    animateClick(this);
  }
}