const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
    pass: "Getchefit01!"
  },
  secureConnection: false,
  tls: { ciphers: 'SSLv3' }
});

function book(req, res, next) {
  const data = req.body;
  console.log(data);
  var diet;
  data.diet ? diet = data.diet.join(", ") : diet = "none";
  const mail = {
    from: 'admin@getchefit.com',
    to: `${data.email}`,
    subject: 'ChefIt Reservation',
    text: `Hello ${data.name}, <br /> welcome to ChefIt. This is a confirmation that you have a dinner for ${data.people} at ${data.time} on ${data.date}. This dinner will be served at ${data.address}. You will be receiving the ${data.package} package. We will take care to mind your dietary restrictions of ${diet}, as well as your special requests for ${data.additional}. Please reach out to us at Admin@getchefit.com if any of this information is incorrect.`,
    html: `Hello ${data.name}, <br /> welcome to ChefIt. This is a confirmation that you have a dinner for ${data.people} at ${data.time} on ${data.date}. This dinner will be served at ${data.address}. You will be receiving the ${data.package} package. We will take care to mind your dietary restrictions of ${diet}, as well as your special requests for ${data.additional}. Please reach out to us at Admin@getchefit.com if any of this information is incorrect.`
  }
  outlookTransport.sendMail(mail, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.render('index', { title: 'Express' });
}

module.exports = router;
