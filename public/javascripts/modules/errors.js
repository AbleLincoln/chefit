const errors = document.querySelector('.errors');
let errorsList = new Map();

function addError(errorName, errorMessage) {
  errorsList.set(errorName, `<p>${errorMessage}</p>`);
  displayErrors();
}

function removeError(errorName) {
  errorsList.delete(errorName);
  displayErrors();
}

function clearErrors() {
  errorsList.clear();
  displayErrors();
}

function displayErrors() {
  let errorMessages = '';
  errorsList.forEach((value, key) => {
    errorMessages += value;
  })
  // const errorsMessage = errorsList.join();
  errors.innerHTML = errorMessages;
  if(errorMessages === '') errors.classList.add('inactive');
  else errors.classList.remove('inactive');
}

export { addError, removeError, clearErrors, displayErrors };