const flatpickr = require('flatpickr');
const flatpickrcss = require('flatpickr/dist/flatpickr.min.css');

flatpickr('.dateInput input', {
  altInput: true,
  minDate: new Date().fp_incr(2)
});