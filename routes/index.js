const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const unirest = require('unirest');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChefIt', submitted: req.query.submitted });
  console.log(req.query.submitted);
});
/* POST book */
router.post('/book', book); // TODO put book in controller
router.post('/square', square);

function square(req, res, next) {
  var token = require('crypto').randomBytes(64).toString('hex');
  purchaseParams = {
    "redirect_url": "https://chefit.herokuapp.com/?submitted=submitted",
    "idempotency_key": token,
    "ask_for_shipping_address": false,
    "merchant_support_email": "admin@getchefit.com",

    "order": {
      "reference_id": "1",
      "line_items": [
        {
          "name": "package",
          "quantity": "1",
          "base_price_money": {
            "amount": 6000,
            "currency": "USD"
          }
        }
      ]
    },
    "pre_populate_buyer_email": "example@example.com"
  };

  unirest.post("https://connect.squareup.com/v2/locations/CBASEIxRbg7g-Aqkv1UU3nEuHjQgAQ/checkouts")
  .headers({
		'Authorization': 'Bearer sandbox-sq0atb-xKIDuP2ShOCu_XvvU7HdWg',
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	})
	.send(purchaseParams)
  .end(response => {
    if (response.body.errors){
			res.json({status: 400, errors: response.body.errors})
		}else{
			res.redirect(response.body.checkout.checkout_page_url);
		};
  })
}

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
    // user: "admin@getchefit.com",
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASS
  },
  secureConnection: false,
  tls: { ciphers: 'SSLv3' }
});

function book(req, res, next) {
  const data = req.body;
  console.log(data);
  const date = new Date(data.date);
  // const date = new Date(Date.parse(data.date));
  console.log(date);
  console.log(date.getMonth());
  console.log(date.getDate());
  var diet;
  if(data.diet) {
    let arr = [].concat(data.diet);
    diet = arr.join(" ");
    // diet = "specified dietary restrictions of " + dietString;
  } else {
    diet = "none";
  }

  // customer email
  const customerMail = {
    from: 'admin@getchefit.com',
    to: `${data.email}`,
    subject: 'ChefIt Reservation',
    // text: `Data.date: ${data.date} UTCDate: ${date.getUTCMonth() + 1}/${date.getUTCDate()}`
    text: `Dear ${data.name}, <br />
    This email is to confirm your CHEFIT reservation with the following details: <br />
    Date: ${date.getUTCMonth() + 1}/${date.getUTCDate()} <br />
    Time of first course: ${data.time} (your chef will arrive an hour and a half before to begin preparations)<br />
    Guests: ${data.people} <br />
    Address: ${data.address} <br />
    Number: ${data.phone} <br />
    Package: ${data.package} <br />
    Appetizer: ${data.appetizer} <br />
    Salad: ${data.salad} <br />
    Main: ${data.main} <br />
    Diet: ${diet} <br />
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
    This email is to confirm your CHEFIT reservation with the following details: <br />
    Date: ${date.getUTCMonth() + 1}/${date.getUTCDate()} <br />
    Time of first course: ${data.time} (your chef will arrive an hour and a half before to begin preparations)<br />
    Guests: ${data.people} <br />
    Address: ${data.address} <br />
    Number: ${data.phone} <br />
    Package: ${data.package} <br />
    Appetizer: ${data.appetizer} <br />
    Salad: ${data.salad} <br />
    Main: ${data.main} <br />
    Diet: ${diet} <br />
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
    text: `Hello ChefIt team, You have a new reservation. <br />
    Name: ${data.name} <br />
    Email: ${data.email} <br />
    Number: ${data.phone} <br />
    Guests: ${data.people} <br />
    Time: ${data.time} <br />
    Date: ${data.date} <br />
    Address: ${data.address} <br />
    Package: ${data.package} <br />
    Appetizer: ${data.appetizer} <br />
    Salad: ${data.salad} <br />
    Main: ${data.main}
    Diet: ${diet} <br />`,
    html: `Hello ChefIt team, you have a new reservation. <br />
    Name: ${data.name} <br />
    Email: ${data.email} <br />
    Number: ${data.phone} <br />
    Guests: ${data.people} <br />
    Time: ${data.time} <br />
    Date: ${data.date} <br />
    Address: ${data.address} <br />
    Package: ${data.package} <br />
    Appetizer: ${data.appetizer} <br />
    Salad: ${data.salad} <br />
    Main: ${data.main}
    Diet: ${diet} <br />`
  }
  outlookTransport.sendMail(adminMail, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  // Zapier parser email
  const zapierMail = {
    from: 'admin@getchefit.com',
    to: `v5x2lxdd@robot.zapier.com`,
    subject: 'New ChefIt Reservation',
    text: `Hello ChefIt team, You have a new reservation.
    Name: ${data.name}
    Email: ${data.email}
    Number: ${data.phone}
    Guests: ${data.people}
    Time: ${data.time}
    Date: ${data.date}
    Address: ${data.address}
    Package: ${data.package}
    Appetizer: ${data.appetizer}
    Salad: ${data.salad}
    Main: ${data.main}
    Diet: ${diet}`
  }
  outlookTransport.sendMail(zapierMail, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  res.redirect('/?submitted=submitted');
}

module.exports = router;
