const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChefIt' });
  console.log(req.query.submitted);
});
/* POST book */
router.post('/book', book); // TODO put book in controller
// Mailer transport
const mailtrapTransport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "7ea456eb37d853",
    pass: "9c83b6ca143f0d"
  }
});
const outlookTransport = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  auth: {
    user: "admin@getchefit.com",
    pass: "Bobbygetchefit1!"
  },
  secureConnection: false,
  tls: { ciphers: 'SSLv3' }
});

function book(req, res, next) {
  const data = req.body;
  console.log(data);
  const date = new Date(data.date);
  console.log(date);
  var diet;
  if(data.diet) {
    diet = "not specified any dietary restrictions";
  } else {
    let arr = [].concat(data.diet);
    let dietString = arr.join(" ");
    diet = "specified dietary restrictions of " + dietString;
  }

  // customer email
  const customerMail = {
    from: 'admin@getchefit.com',
    to: `${data.email}`,
    subject: 'ChefIt Reservation',
    text: `Dear ${data.name}, <br />
    Thank you for booking your CHEFIT dinner for ${data.people} on ${date.getMonth()} ${date.getDate()} at ${data.address}. Your dinner will be served at ${data.time}, however, the chef will arrive approximately an hour and a half before this time in order to prepare. You will be served the ${data.package} package with a menu of ${data.appetizer}, ${data.salad}, and ${data.main}. According to our information, you have ${diet}.
    <br /> Please have the dishwasher emptied prior to the meal to make the process easier for our chef and have the kitchen clean and ready for our chef to execute the meal. This process requires a functioning kitchen with a working stovetop and oven. Also, please notify us of any specific parking issues that our chef should be made aware of. If you have any further questions or if any of the information on our end is incorrect, please contact us at admin@getchefit.com. Thank you for booking through CHEFIT and we hope you enjoy this one of a kind home dining experience.
    <br /> Please remember
    <ul>
      <li>There is a 48-hour cancellation policy with this reservation.</li>
      <li>Note that the chef will need to ARRIVE an hour and a half before the selected dinner time.</li>
      <li>Please take note of our add-on options for desserts and wine.</li>
      <li>Please allow and plan for an hour of prep time before your first dish is served.</li>
      <li>The CHEFIT team would greatly appreciate it if you would fill out a quick online survey following the meal.</li>
    </ul>`,
    html: `Dear ${data.name}, <br />
    Thank you for booking your CHEFIT dinner for ${data.people} on ${date.getMonth()} ${date.getDate()} at ${data.address}. Your dinner will be served at ${data.time}, however, the chef will arrive approximately an hour and a half before this time in order to prepare. You will be served the ${data.package} package with a menu of ${data.appetizer}, ${data.salad}, and ${data.main}. According to our information, you have ${diet}.
    <br /> Please have the dishwasher emptied prior to the meal to make the process easier for our chef and have the kitchen clean and ready for our chef to execute the meal. This process requires a functioning kitchen with a working stovetop and oven. Also, please notify us of any specific parking issues that our chef should be made aware of. If you have any further questions or if any of the information on our end is incorrect, please contact us at admin@getchefit.com. Thank you for booking through CHEFIT and we hope you enjoy this one of a kind home dining experience.
    <br /> Please remember
    <ul>
      <li>There is a 48-hour cancellation policy with this reservation.</li>
      <li>Note that the chef will need to ARRIVE an hour and a half before the selected dinner time.</li>
      <li>Please take note of our add-on options for desserts and wine.</li>
      <li>Please allow and plan for an hour of prep time before your first dish is served.</li>
      <li>The CHEFIT team would greatly appreciate it if you would fill out a quick online survey following the meal.</li>
    </ul>`
  }
  outlookTransport.sendMail(customerMail, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  // admin email
  const adminMail = {
    from: 'admin@getchefit.com',
    to: `admin@getchefit.com`,
    subject: 'New ChefIt Reservation',
    text: `Hello ChefIt team, <br /> You have a new reservation. ${data.name} made a reservation for ${data.people} at ${data.time} on ${data.date}. This dinner will be served at ${data.address}. They will be receiving the ${data.package} package with a menu of ${data.appetizer}, ${data.salad}, and ${data.main}. They have ${diet}.`,
    html: `Hello ChefIt team, <br /> You have a new reservation. ${data.name} made a reservation for ${data.people} at ${data.time} on ${data.date}. This dinner will be served at ${data.address}. They will be receiving the ${data.package} package with a menu of ${data.appetizer}, ${data.salad}, and ${data.main}. They have ${diet}.`
  }
  outlookTransport.sendMail(adminMail, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  res.redirect('/?submitted=true');
}

module.exports = router;
