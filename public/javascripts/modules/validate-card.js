import { isMobilePhone, isPostalCode } from "validator";
import { removeError } from "./errors";

function validateCard(card) {
  const inputs = card.querySelectorAll('.input input, .input select');
  let invalid = false;
  inputs.forEach(input => {
    if(input.value === null || input.value === "") {
      input.classList.add('invalid');
      invalid = true;
      // input.classList.add('error');
      // addError('empty field', 'Please fill out all fields');
    } else if(!input.checkValidity()) {
      input.classList.add('invalid');
      invalid = true;
      // addError(`invalid ${input.name}`, `Please input your ${input.name} in a valid format`);
    } else if (input.type == "tel") { // phone input
      if(!isMobilePhone(input.value, 'en-US')) {
        input.classList.add('invalid');
        invalid = true;
      }
    } else if (input.name == "zip") {
      if(!isPostalCode(input.value, 'US')) {
        input.classList.add('invalid');
        invalid = true;
      }
    } else {
      input.classList.remove('invalid');
      removeError(`invalid ${input.name}`);
    }
  })

  let appSelected = false;
  let saladSelected = false;
  let mainSelected = false;
  const radios = card.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    if(radio.name === "appetizer" && radio.checked) appSelected = true;
    else if(radio.name === "salad" && radio.checked) saladSelected = true;
    else if(radio.name === "main" && radio.checked) mainSelected = true;
  });
  if(radios.length === 0 || (appSelected && saladSelected && mainSelected)) {
    document.querySelector('body').classList.remove('modal-open');
  }
  else {
    invalid = true;
  }

  if(invalid) {
    return false;
  }
  else return true;
}

export default validateCard;